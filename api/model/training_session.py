"""imports"""
import datetime
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from config.postgres import db


class training_session(db.Model):
    """Base class for training sessions"""
    __table_args__ = (db.UniqueConstraint('date',
                                          'training_session_category_id'), )

    id = Column(UUID(as_uuid=True),
                primary_key=True,
                default=lambda: uuid4().hex)
    date = Column(TIMESTAMP(timezone=False),
                  nullable=False,
                  default=datetime.datetime.now())
    duration = Column(Integer, unique=False, nullable=False)

    training_session_category_id = Column(String(35),
                                          db.ForeignKey("category.id"))
    training_session_category = db.relationship(
        "Category", back_populates="training_sessions")
    goalkeepers_performances = db.relationship("training_monitoring",
                                               back_populates="session")

    def __init__(self, date, duration, category):
        self.date = date
        self.duration = duration
        self.training_session_category = category

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'date': self.date.strftime('%d/%m/%Y %H:%M'),
            'duration': self.duration,
            'category': self.training_session_category.serialize
        }
