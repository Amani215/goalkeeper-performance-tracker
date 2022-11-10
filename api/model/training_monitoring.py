"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from config.postgres import db


class training_monitoring(db.Model):
    """Base class for training monitoring"""
    __table_args__ = (db.UniqueConstraint('session_id', 'goalkeeper_id'), )

    id = Column(UUID(as_uuid=True),
                primary_key=True,
                default=lambda: uuid4().hex)
    session_id = Column(UUID(as_uuid=True),
                        db.ForeignKey("training_session.id"))
    session = db.relationship("training_session",
                              back_populates="goalkeepers_performances")

    goalkeeper_id = Column(UUID(as_uuid=True), db.ForeignKey("goalkeeper.id"))
    goalkeeper = db.relationship("Goalkeeper",
                                 back_populates="training_performances",
                                 foreign_keys=[goalkeeper_id])

    absent = Column(Boolean, unique=False, default=False)
    dismissed = Column(Boolean, unique=False, default=False)
    hurt = Column(Boolean, unique=False, default=False)
    with_seniors = Column(Boolean, unique=False, default=False)
    with_national_team = Column(Boolean, unique=False, default=False)
    training_form = Column(String(128), unique=False, nullable=True)
    comment = Column(String(128), unique=False, nullable=True)

    def __init__(self, goalkeeper, session):
        self.goalkeeper = goalkeeper
        self.session = session

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'goalkeeper_id': self.goalkeeper_id,
            'session_id': self.session_id,
            'absent': self.absent,
            'dismissed': self.dismissed,
            'hurt': self.hurt,
            'with_seniors': self.with_seniors,
            'with_national_team': self.with_national_team,
            'training_form': self.training_form,
            'comment': self.comment
        }
