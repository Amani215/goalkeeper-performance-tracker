"""imports"""
import os
from uuid import uuid4
from sqlalchemy import Column, Date, String, Integer
from config import db


class training_session(db.Model):
    """Base class for training sessions"""
    __table_args__ = (db.UniqueConstraint('date',
                                          'training_session_category_id'), )

    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    date = Column(Date, unique=False, nullable=False)
    duration = Column(Integer, unique=False, nullable=False)

    training_session_category_id = Column(String(35),
                                          db.ForeignKey("category.id"))
    training_session_category = db.relationship(
        "Category", back_populates="training_sessions")
    goalkeepers_performances = db.relationship("training_monitoring",
                                               back_populates="session")
    training_form = Column(String(128), unique=False, nullable=True)

    def __init__(self, date, duration, category):
        self.date = date
        self.duration = duration
        self.training_session_category = category

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        PUBLIC_S3 = os.environ['PUBLIC_S3']
        return {
            'id': self.id,
            'date': self.date.strftime('%d/%m/%Y'),
            'duration': self.duration,
            'category': self.training_session_category.serialize,
            'training_form': f'{PUBLIC_S3}{self.training_form}'
        }
