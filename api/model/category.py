"""imports"""
from sqlalchemy import Boolean, Column, String
from config import db
from model.association_tables import trainer_categories, goalkeeper_categories


class Category(db.Model):
    """Class that represents the categories of the goalkeepers"""
    id = Column(String(35), primary_key=True, unique=True)
    name = Column(String(30), unique=False, nullable=False)
    season = Column(String(10), unique=False, nullable=False)
    trainers = db.relationship('User',
                               secondary=trainer_categories,
                               back_populates='categories')
    goalkeepers = db.relationship('Goalkeeper',
                                  secondary=goalkeeper_categories,
                                  back_populates='categories')
    matches = db.relationship('Match', back_populates='match_category')
    training_sessions = db.relationship(
        'training_session', back_populates='training_session_category')
    plannings = db.relationship('Planning', back_populates='category')
    archived = Column(Boolean, unique=False, default=False)

    def __init__(self, name: str, season: str):
        self.id = name + str(season)
        self.name = name
        self.season = season

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'name': self.name,
            'season': self.season,
            'archived': self.archived
        }
