"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from config import db


class training_monitoring(db.Model):
    """Base class for training monitoring"""
    __table_args__ = (db.UniqueConstraint('session_id', 'goalkeeper_id'), )

    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    session_id = Column(String, db.ForeignKey("training_session.id"))
    session = db.relationship("training_session",
                              back_populates="goalkeepers_performances")

    goalkeeper_id = Column(String, db.ForeignKey("goalkeeper.id"))
    goalkeeper = db.relationship("Goalkeeper",
                                 back_populates="training_performances",
                                 foreign_keys=[goalkeeper_id])

    attendance = Column(String(128),
                        unique=False,
                        nullable=True,
                        default='Present')
    attendance_time = Column(Integer, unique=False, default=0)

    def __init__(self, goalkeeper, session):
        self.goalkeeper = goalkeeper
        self.session = session

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'goalkeeper': self.goalkeeper.serialize,
            'session': self.session.serialize,
            'attendance': self.attendance,
            'attendance_time': self.attendance_time
        }
