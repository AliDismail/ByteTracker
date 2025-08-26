from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

DATABASE_URL = "postgresql://postgres:karim123@localhost/dataprjct" # creating the connection to the database

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)

def init_db():
    Base.metadata.create_all(bind=engine)
