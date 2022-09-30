"""imports"""
from sqlalchemy import Column, String, Integer
from model import db

class Category(db.Model):
    """Class that represents the categories of the goalkeepers"""
    id = Column(String(35), primary_key=True, unique=True)
    name = Column(String(30), unique=False, nullable=False)
    season = Column(Integer, unique=False, nullable=False)

    def __init__(self, name, season):
        self.id = name + str(season)
        self.name = name
        self.season  = season
    
    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id'  : self.id,
            'category name': self.name,
            'season': self.season
        }
