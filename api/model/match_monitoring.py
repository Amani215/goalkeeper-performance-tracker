"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
# from sqlalchemy.dialects.postgresql import UUID
from config import db


class match_monitoring(db.Model):
    """Base class for match monitoring"""
    __table_args__ = (db.UniqueConstraint('match_id', 'main_goalkeeper_id'), )

    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    match_id = Column(String, db.ForeignKey("match.id"))
    match = db.relationship("Match", back_populates="goalkeepers_performances")

    main_goalkeeper_id = Column(String, db.ForeignKey("goalkeeper.id"))
    main_goalkeeper = db.relationship("Goalkeeper",
                                      back_populates="match_performances",
                                      foreign_keys=[main_goalkeeper_id])

    time_played = Column(Integer, unique=False, default=0)
    goals_scored = Column(Integer, unique=False, default=0)
    goals_conceded = Column(Integer, unique=False, default=0)
    penalties_saved = Column(Integer, unique=False, default=0)
    penalties_non_saved = Column(Integer, unique=False, default=0)
    yellow_cards = Column(Integer, unique=False, default=0)
    red_cards = Column(Integer, unique=False, default=0)
    grade = Column(Integer, unique=False, default=0)
    assets = Column(String(128), unique=False, nullable=True)
    flaws = Column(String(128), unique=False, nullable=True)
    comment = Column(String(128), unique=False, nullable=True)

    def __init__(self, goalkeeper, match):
        self.main_goalkeeper = goalkeeper
        self.match = match

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'goalkeeper': self.main_goalkeeper.serialize,
            'match': self.match.serialize,
            'time_played': self.time_played,
            'goals_scored': self.goals_scored,
            'goals_conceded': self.goals_conceded,
            'penalties_saved': self.penalties_saved,
            'penalties_non_saved': self.penalties_non_saved,
            'yellow_cards': self.yellow_cards,
            'red_cards': self.red_cards,
            'grade': self.grade,
            'assets': self.assets,
            'flaws': self.flaws,
            'comment': self.comment
        }
