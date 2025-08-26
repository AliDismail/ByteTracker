from fastapi import FastAPI, HTTPException, Depends, Request, Query, Form, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from database import init_db, SessionLocal
from sqlalchemy.orm import Session
from models import User, Item, ItemStatus, TrackingStatus
from populate_users import populate_users
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from populate_items import populate_items

init_db()
populate_users()  # Populate the database with dummy users
populate_items()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="templates/static"), name="static")

# Set up templates folder
templates = Jinja2Templates(directory="templates")

# Render homepage
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/found", response_class=HTMLResponse)
async def found_page(request: Request):
    return templates.TemplateResponse("found.html", {"request": request})

@app.get("/lost", response_class=HTMLResponse)
async def lost_page(request: Request):
    return templates.TemplateResponse("lost.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

def get_db():  # Setting up the database
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# -------------------- MODELS -------------------- #

class LostItem(BaseModel):
    id: Optional[int] = None
    type_of_object: str
    status: ItemStatus = ItemStatus.lost  # Default to 'lost'
    location: str
    description: Optional[str] = None
    contact_info: str
    image_url: Optional[str] = None
    date_posted: Optional[datetime] = None
    tracking_status: TrackingStatus = TrackingStatus.pending  # Default to 'pending'
    verification_question: Optional[str] = None
    expected_answer: Optional[str] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True

class FoundItem(BaseModel):
    id: Optional[int] = None
    type_of_object: str
    status: ItemStatus = ItemStatus.found  # Default to 'found'
    location: str
    description: Optional[str] = None
    contact_info: str
    image_url: Optional[str] = None
    date_posted: Optional[datetime] = None
    tracking_status: TrackingStatus = TrackingStatus.pending  # Default to 'pending'
    verification_question: Optional[str] = None
    expected_answer: Optional[str] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True

# -------------------- AUTH -------------------- #

@app.post("/token")  # FastAPI will create a session for using the db
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()  # Get the user from the db based on the email
    if not user or user.password_hash != form_data.password:  # Check for password
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"access_token": user.email, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == token).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    return user

# -------------------- ROUTES -------------------- #

@app.post("/lost", response_model=LostItem)
def report_lost(item: LostItem, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_item = Item(
        type_of_object=item.type_of_object,
        status=ItemStatus.lost,
        location=item.location,
        description=item.description,
        date_posted=datetime.utcnow(),
        tracking_status=item.tracking_status,
        user_id=user.id,
        contact_info=f"{user.phone_number} | {user.email}",
        image_url=item.image_url,
        verification_question=item.verification_question,
        expected_answer=item.expected_answer
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.get("/search")
def search_items(query: str = Query(...), db: Session = Depends(get_db)):
    results = db.query(Item).filter(
        Item.type_of_object.ilike(f"%{query}%") | 
        Item.description.ilike(f"%{query}%") |
        Item.location.ilike(f"%{query}%")
    ).all()

    return [
        {
            "type_of_object": item.type_of_object,
            "location": item.location,
            "description": item.description,
            "date_posted": item.date_posted
        }
        for item in results
    ]

@app.get("/lost-items")
def get_lost_items(
    query: Optional[str] = None,
    sort: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query_obj = db.query(Item).filter(Item.status == ItemStatus.lost)

    # Apply search query filter
    if query:
        query_obj = query_obj.filter(
            Item.type_of_object.ilike(f"%{query}%") |
            Item.description.ilike(f"%{query}%") |
            Item.location.ilike(f"%{query}%")
        )

    # Apply location filter if provided
    if location:
        query_obj = query_obj.filter(Item.location.ilike(f"%{location}%"))

    # Apply sorting if provided
    if sort == "asc":
        query_obj = query_obj.order_by(Item.date_posted.asc())
    elif sort == "desc":
        query_obj = query_obj.order_by(Item.date_posted.desc())

    items = query_obj.all()

    return [
        {
            "type_of_object": item.type_of_object,
            "location": item.location,
            "description": item.description,
            "date_posted": item.date_posted.strftime("%Y-%m-%d"),
            "contact_info": item.contact_info
        }
        for item in items
    ]


@app.post("/lost/{item_id}/mark_returned")
def mark_lost_item_as_found(item_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Find the lost item
    item = db.query(Item).filter(Item.id == item_id,
                                  (Item.status == ItemStatus.lost) |
                                 (Item.status == ItemStatus.found)).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found or unauthorized")

    item.tracking_status = TrackingStatus.done
    item.status = ItemStatus.returned
    db.commit()
    db.refresh(item)

    return {"message": "Item marked as found", "found_item": item}

@app.post("/found", response_model=FoundItem)
def report_found(item: FoundItem, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not item.verification_question or item.verification_question == "string":
        raise HTTPException(status_code = 400, detail = "Verification question required")
    if not item.expected_answer or item.expected_answer == "string":
        raise HTTPException(status_code = 400, detail = "Expected answer required")


    new_item = Item(
        type_of_object=item.type_of_object,
        status=ItemStatus.found,
        location=item.location,
        description=item.description,
        date_posted=datetime.utcnow(),
        tracking_status=item.tracking_status,
        user_id=user.id,
        contact_info=f"{user.phone_number} | {user.email}",
        image_url=item.image_url,
        verification_question=item.verification_question,
        expected_answer=item.expected_answer
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@app.get("/found", response_model=List[FoundItem])
def get_found_items(sort: Optional[str] = None, location: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Item).filter(Item.status == ItemStatus.found)
    if search:
        query = query.filter(Item.type_of_object.ilike(f"%{search}%") | Item.description.ilike(f"%{search}%"))
    if location:
        query = query.filter(Item.location.ilike(location))
    if sort == "asc":
        query = query.order_by(Item.date_posted.asc())
    elif sort == "desc":
        query = query.order_by(Item.date_posted.desc())
    return query.all()

@app.get("/found-items")
def get_found_items(
    query: Optional[str] = None,
    sort: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query_obj = db.query(Item).filter(Item.status == ItemStatus.found)

    # Apply search query filter
    if query:
        query_obj = query_obj.filter(
            Item.type_of_object.ilike(f"%{query}%") |
            Item.description.ilike(f"%{query}%") |
            Item.location.ilike(f"%{query}%")
        )

    # Apply location filter if provided
    if location:
        query_obj = query_obj.filter(Item.location.ilike(f"%{location}%"))

    # Apply sorting if provided
    if sort == "asc":
        query_obj = query_obj.order_by(Item.date_posted.asc())
    elif sort == "desc":
        query_obj = query_obj.order_by(Item.date_posted.desc())

    items = query_obj.all()

    return [
        {
            "id": item.id,
            "type_of_object": item.type_of_object,
            "location": item.location,
            "description": item.description,
            "date_posted": item.date_posted.strftime("%Y-%m-%d"),
            "contact_info": item.contact_info,
            "verification_question": item.verification_question,
            "expected_answer": item.expected_answer
        }
        for item in items
    ]

@app.get("/found-items/{item_id}/verification")
def get_verification_question(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id, Item.status == ItemStatus.found).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return {
        "verification_question": item.verification_question,
        "expected_answer": item.expected_answer
    }

@app.get("/latest-items")
def get_latest_items(db: Session = Depends(get_db)):
    lost_items = db.query(Item).filter(Item.status == "lost").order_by(Item.date_posted.desc()).limit(3).all()
    found_items = db.query(Item).filter(Item.status == "found").order_by(Item.date_posted.desc()).limit(3).all()
    return {
        "lost_items": [
            {"type": item.type_of_object, "description": item.description, "location": item.location, "date": item.date_posted}
            for item in lost_items
        ],
        "found_items": [
            {"type": item.type_of_object, "description": item.description, "location": item.location, "date": item.date_posted}
            for item in found_items
        ],
    }

@app.post("/register-item")
async def register_item(
    type_of_object: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    date_posted: str = Form(...),
    status: str = Form(...),
    image_url: UploadFile = File(None),
    verification_question: Optional[str] = Form(None),
    expected_answer: Optional[str] = Form(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_item = Item(
        type_of_object=type_of_object,
        location=location,
        description=description,
        date_posted=date_posted,
        status=status,
        image_url=image_url.filename if image_url else None,
        verification_question=verification_question,
        expected_answer=expected_answer,
        user_id=user.id,
        contact_info=f"{user.phone_number} | {user.email}",
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"message": "Item registered successfully"}

@app.get("/")
def root():
    return {"message": "Lost and Found backend is running."}
