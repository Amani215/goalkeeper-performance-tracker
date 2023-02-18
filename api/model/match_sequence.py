"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from config import db


class match_sequence(db.Model):
    """Base class for match sequences"""
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))

    mstch_performance_id = Column(String, db.ForeignKey("match_monitoring.id"))
    match_performance = db.relationship("match_monitoring",
                                        back_populates="match_sequences")

    sequence_number = Column(Integer, unique=False, default=0)
    action_type = Column(String(128), unique=False, default="")
    reaction_type = Column(String(128), unique=False, default="")
    action_result = Column(String(128), unique=False, default="")
    comment = Column(String(128), unique=False, default="")

    def __init__(self, match_performance):
        self.match_performance = match_performance

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'match_performance': self.match_performance.serialize,
            'sequence_number': self.sequence_number,
            'action_type': self.action_type,
            'reaction_type': self.reaction_type,
            'action_result': self.action_result,
            'comment': self.comment
        }
