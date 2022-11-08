"""imports"""
from sqlalchemy import Column, String, Integer
from config.postgres import db
from model.association_tables import trainer_categories


class Category(db.Model):
    """Class that represents the categories of the goalkeepers"""
    id = Column(String(35), primary_key=True, unique=True)
    name = Column(String(30), unique=False, nullable=False)
    season = Column(Integer, unique=False, nullable=False)
    trainers = db.relationship("User",
                               secondary=trainer_categories,
                               back_populates="categories")

    def __init__(self, name: str, season: int):
        self.id = name + str(season)
        self.name = name
        self.season = season

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {'id': self.id, 'name': self.name, 'season': self.season}
