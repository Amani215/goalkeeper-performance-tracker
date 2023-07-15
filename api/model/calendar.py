"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from config import db
from flask import jsonify


class Calendar(db.Model):
    """Base class for calendars"""
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    calendar_type = Column(String(128), unique=False, nullable=False)
    category_id = Column(String(35), db.ForeignKey("category.id"))
    calendar_category = db.relationship("Category", back_populates="calendars")
    items = db.relationship('CalendarItem', back_populates='calendar')

    def __init__(self, calendar_type, category):
        self.calendar_type = calendar_type
        self.calendar_category = category
        self.category_id = category.id

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'category': self.calendar_category.serialize,
            'calendar_type': self.calendar_type,
            'items': [i.serialize for i in self.items]
        }
