"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Integer
from config import db
from model.goalkeeper import Goalkeeper
from model.match import Match


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

    match_sequences = db.relationship("match_sequence",
                                      back_populates="match_performance")

    time_played = Column(Integer, unique=False, default=0)
    goals_scored = Column(Integer, unique=False, default=0)
    goals_conceded = Column(Integer, unique=False, default=0)
    penalties_saved = Column(Integer, unique=False, default=0)
    penalties_non_saved = Column(Integer, unique=False, default=0)

    # Remise du partenaire
    successful_deliveries = Column(Integer, unique=False, default=0)
    non_successful_deliveries = Column(Integer, unique=False, default=0)
    # Ballons en profondeur
    successful_ballon_profondeur = Column(Integer, unique=False, default=0)
    non_successful_ballon_profondeur = Column(Integer, unique=False, default=0)
    # Relance mains
    successful_hand_relaunch = Column(Integer, unique=False, default=0)
    non_successful_hand_relaunch = Column(Integer, unique=False, default=0)
    # Relance pieds
    successful_foot_relaunch = Column(Integer, unique=False, default=0)
    non_successful_foot_relaunch = Column(Integer, unique=False, default=0)

    balls_touched = Column(Integer, unique=False, default=0)
    yellow_cards = Column(Integer, unique=False, default=0)
    red_cards = Column(Integer, unique=False, default=0)
    grade = Column(Integer, unique=False, default=0)
    assets = Column(String(128), unique=False, nullable=True)
    flaws = Column(String(128), unique=False, nullable=True)
    comment = Column(String(128), unique=False, nullable=True)

    def __init__(self, goalkeeper: Goalkeeper, match: Match):
        self.main_goalkeeper = goalkeeper
        self.main_goalkeeper_id = goalkeeper.id
        self.match = match
        self.match_id = match.id

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
            'successful_deliveries': self.successful_deliveries,
            'non_successful_deliveries': self.non_successful_deliveries,
            'successful_ballon_profondeur': self.successful_ballon_profondeur,
            'non_successful_ballon_profondeur':
            self.non_successful_ballon_profondeur,
            'successful_hand_relaunch': self.successful_hand_relaunch,
            'non_successful_hand_relaunch': self.non_successful_hand_relaunch,
            'successful_foot_relaunch': self.successful_foot_relaunch,
            'non_successful_foot_relaunch': self.non_successful_foot_relaunch,
            'balls_touched': self.balls_touched,
            'yellow_cards': self.yellow_cards,
            'red_cards': self.red_cards,
            'grade': self.grade,
            'assets': self.assets,
            'flaws': self.flaws,
            'comment': self.comment
        }
