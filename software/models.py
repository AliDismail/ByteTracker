from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import enum

Base = declarative_base() #foundation of all orm mapped classes

class ItemStatus(enum.Enum): # defines a class for the status of the item that can be either lost or found
    lost = "lost"
    found = "found"
    returned = "returned"

class TrackingStatus(enum.Enum): # defines a class for the tracking status of the item that can be either pending, waiting or done
    pending = "Pending"
    waiting = "Waiting"
    done = "Done"

class User(Base): # defines a class for an object User with its corresponding table and attributes
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    university_id = Column(Integer, nullable = False)

    items = relationship("Item", back_populates="user") # create relationship such as a user can have many items of type class Item

class Item(Base): # defines a class for an object Item with its corresponding table and attributes
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    type_of_object = Column(String, nullable=False)
    status = Column(Enum(ItemStatus), nullable=False) # enum(ItemStatus) defines the status of the item as either lost or found
    location = Column(String, nullable=False)
    description = Column(Text)
    contact_info = Column(String, nullable=False)
    image_url = Column(String)
    date_posted = Column(DateTime, default=datetime.utcnow)
    tracking_status = Column(Enum(TrackingStatus), default=TrackingStatus.pending)

    verification_question = Column(Text)
    expected_answer = Column(Text)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="items") # create relastionship such as each item has one User
