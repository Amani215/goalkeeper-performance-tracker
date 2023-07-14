"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from config import db


class Calendar(db.Model):
    """Base class for calendars"""
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    calendar_type = Column(String(128), unique=False, nullable=False)
    journey = Column(Integer, unique=False, nullable=False)
    local = Column(String(128), unique=False, nullable=False)
    visitor = Column(String(128), unique=False, nullable=False)
    category_id = Column(String(35), db.ForeignKey("category.id"))
    calendar_category = db.relationship("Category", back_populates="calendars")

    def __init__(self, calendar_type, journey, local, visitor, category):
        self.calendar_type = calendar_type
        self.journey = journey
        self.local = local
        self.visitor = visitor
        self.calendar_category = category
        self.category_id = category.id

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'category': self.calendar_category.serialize,
            'calendar_type': self.calendar_type,
            'journey': self.journey,
            'local': self.local,
            'visitor': self.visitor,
        }
