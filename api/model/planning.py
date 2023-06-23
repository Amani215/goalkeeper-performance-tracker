'''Planning Model. This model has one to many relationship with the Category model.'''
from config import db
from sqlalchemy import Column, String, Date


class Planning(db.Model):
    '''Class that holds the planning of a category for specific day'''
    id = Column(String(35), primary_key=True, unique=True)
    category_id = Column(String(35), db.ForeignKey("category.id"))
    category = db.relationship("Category", back_populates="plannings")
    date = Column(Date, unique=False, nullable=False)
    type = Column(String(35), unique=False, nullable=False)
    techniques = Column(String(35), unique=False, nullable=True)
    physiques = Column(String(35), unique=False, nullable=True)
    psychomotricity = Column(String(35), unique=False, nullable=True)
    tactics = Column(String(35), unique=False, nullable=True)
    observation = Column(String(80), unique=False, nullable=True)

    def __init__(self, category, date, type):
        self.category = category
        self.date = date
        self.type = type

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'category_id': self.category_id,
            'date': self.date.strftime('%d/%m/%Y'),
            'type': self.type,
            'techniques': self.techniques,
            'physiques': self.physiques,
            'psychomotricity': self.psychomotricity,
            'tactics': self.tactics,
            'observation': self.observation
        }