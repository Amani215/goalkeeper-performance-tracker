"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from config import db


class CalendarItem(db.Model):
    """Base class for calendar items"""
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    calendar_id = Column(String(35), db.ForeignKey("calendar.id"))
    calendar = db.relationship("Calendar", back_populates="items")
    journey = Column(Integer, unique=False, nullable=False)
    local = Column(String(128), unique=False, nullable=False)
    visitor = Column(String(128), unique=False, nullable=False)

    def __init__(self, journey, local, visitor, calendar):
        self.journey = journey
        self.local = local
        self.visitor = visitor
        self.calendar = calendar
        self.calendar_id = calendar.id

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'journey': self.journey,
            'local': self.local,
            'visitor': self.visitor,
        }
