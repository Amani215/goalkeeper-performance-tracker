'''imports'''
import os
from uuid import uuid4
from sqlalchemy import Column, String, Date
from config import db
from model.association_tables import goalkeeper_categories


class Goalkeeper(db.Model):
    '''Goalkeeper model'''
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    name = Column(String(80), unique=True, nullable=False)
    picture = Column(String(128), unique=False, nullable=True)
    birthday = Column(Date, unique=False, nullable=False)
    phone = Column(String(15), unique=False, nullable=True)
    categories = db.relationship('Category',
                                 secondary=goalkeeper_categories,
                                 lazy='subquery',
                                 back_populates="goalkeepers")
    match_performances = db.relationship("match_monitoring",
                                         back_populates="main_goalkeeper")
    training_performances = db.relationship("training_monitoring",
                                            back_populates="goalkeeper")
    growth = db.relationship("growth_monitoring", back_populates="goalkeeper")

    def __init__(self, name, birthday):
        self.name = name
        self.birthday = birthday

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        PUBLIC_S3 = os.environ['PUBLIC_S3']
        return {
            'id':
            self.id,
            'name':
            self.name,
            'birthday':
            str(self.birthday.day) + '/' + str(self.birthday.month) + '/' +
            str(self.birthday.year),
            'phone':
            self.phone,
            'picture':
            f'{PUBLIC_S3}{self.picture}'
        }
