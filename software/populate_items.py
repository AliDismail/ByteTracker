from sqlalchemy.orm import Session
from database import SessionLocal
from models import Item
from datetime import datetime, timedelta
import random

def populate_items():
    db: Session = SessionLocal()
    try:
        # Check if the items table is empty
        if db.query(Item).count() == 0:
            # Define possible locations
            locations = [
                "Zakhem", "Old Caff", "Lounge", "Frem", "ELRC",
                "Science", "Bassil", "Medical Building", "Library", "Block A"
            ]

            # Generate dummy items
            dummy_items = [
                Item(
                    type_of_object="Laptop",
                    status="lost",
                    location=random.choice(locations),
                    description="A silver laptop with a sticker on the back.",
                    date_posted=(datetime.now() - timedelta(days=random.randint(1, 60))).date(),
                    contact_info="string",
                    image_url="string",
                    tracking_status="pending",
                    user_id=random.choice([1, 2, 3])
                ),
                Item(
                    type_of_object="Wallet",
                    status="found",
                    location=random.choice(locations),
                    description="A black leather wallet with some cash inside.",
                    date_posted=(datetime.now() - timedelta(days=random.randint(1, 60))).date(),
                    verification_question="What color is the wallet?",
                    expected_answer="Black",
                    contact_info="string",
                    image_url="string",
                    tracking_status="pending",
                    user_id=random.choice([1, 2, 3])
                ),
                Item(
                    type_of_object="Phone",
                    status="lost",
                    location=random.choice(locations),
                    description="A smartphone with a cracked screen.",
                    date_posted=(datetime.now() - timedelta(days=random.randint(1, 60))).date(),
                    contact_info="string",
                    image_url="string",
                    tracking_status="pending",
                    user_id=random.choice([1, 2, 3])
                ),
                Item(
                    type_of_object="Keys",
                    status="found",
                    location=random.choice(locations),
                    description="A set of keys with a red keychain.",
                    date_posted=(datetime.now() - timedelta(days=random.randint(1, 60))).date(),
                    verification_question="What color is the keychain?",
                    expected_answer="Red",
                    contact_info="string",
                    image_url="string",
                    tracking_status="pending",
                    user_id=random.choice([1, 2, 3])
                ),
                Item(
                    type_of_object="Notebook",
                    status="lost",
                    location=random.choice(locations),
                    description="A blue notebook with handwritten notes.",
                    date_posted=(datetime.now() - timedelta(days=random.randint(1, 60))).date(),
                    contact_info="string",
                    image_url="string",
                    tracking_status="pending",
                    user_id=random.choice([1, 2, 3])
                )
            ]

            # Add dummy items to the database
            db.add_all(dummy_items)
            db.commit()
            print("Items table populated with dummy data.")
        else:
            print("Items table is not empty. No action taken.")
    finally:
        db.close()

if __name__ == "__main__":
    populate_items()