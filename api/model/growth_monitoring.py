"""imports"""
from uuid import uuid4
from sqlalchemy import Column, Integer, Date, String
# from sqlalchemy.dialects.postgresql import UUID
from config import db


class growth_monitoring(db.Model):
    """Base class for growth monitoring"""
    __table_args__ = (db.UniqueConstraint('date', 'goalkeeper_id'), )

    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))

    goalkeeper_id = Column(String, db.ForeignKey("goalkeeper.id"))
    goalkeeper = db.relationship("Goalkeeper",
                                 back_populates="growth",
                                 foreign_keys=[goalkeeper_id])
    date = Column(Date, unique=False, nullable=False)
    weight = Column(Integer, unique=False, default=0)
    height = Column(Integer, unique=False, default=0)
    torso_height = Column(Integer, unique=False, default=0)
    thoracic_perimeter = Column(Integer, unique=False, default=0)
    annual_growth = Column(Integer, unique=False, default=0)

    def __init__(self, goalkeeper, date):
        self.goalkeeper = goalkeeper
        self.date = date

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'goalkeeper_id': self.goalkeeper_id,
            'date': self.date.strftime('%d/%m/%Y'),
            'weight': self.weight,
            'height': self.height,
            'torso_height': self.torso_height,
            'thoracic_perimeter': self.thoracic_perimeter,
            'annual_growth': self.annual_growth
        }
