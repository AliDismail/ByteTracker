from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
#from passlib.hash import bcrypt
from datetime import datetime

def populate_users():
    db: Session = SessionLocal()
    try:
        # Check if the users table is empty
        if db.query(User).count() == 0:
            # Insert dummy users
            dummy_users = [
                User(
                    email="karim.sakr02@lau.edu",
                    password_hash="123",
                    first_name="Karim",
                    last_name="Sakr",
                    phone_number="76463462",
                    university_id= 202303146
                ),
                User(
                    email="ali.ismail@lau.edu",
                    password_hash="ali",
                    first_name="Ali",
                    last_name="Ismail",
                    phone_number="12345678",
                    university_id=202303147
                ),
                User(
                    email="christopher.farah@lau.edu",
                    password_hash="farah",
                    first_name="Christopher",
                    last_name="Farah",
                    phone_number="555555555",
                    university_id=202303148
                )
            ]
            db.add_all(dummy_users)
            db.commit()
        else:
            print("Users table is not empty. No action taken.")
    finally:
        db.close()

if __name__ == "__main__":
    populate_users()