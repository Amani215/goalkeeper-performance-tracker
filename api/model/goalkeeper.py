'''imports'''
from uuid import uuid4
from sqlalchemy import Column, String, Date
from sqlalchemy.dialects.postgresql import UUID
from config.postgres import db
from model.association_tables import goalkeeper_categories


class Goalkeeper(db.Model):
    '''Goalkeeper model'''
    id = Column(UUID(as_uuid=True),
                primary_key=True,
                default=lambda: uuid4().hex)
    name = Column(String(80), unique=True, nullable=False)
    picture = Column(String(128), unique=False, nullable=True)
    birthday = Column(Date, unique=False, nullable=False)
    phone = Column(String(15), unique=False, nullable=True)
    categories = db.relationship('Category',
                                 secondary=goalkeeper_categories,
                                 lazy='subquery',
                                 back_populates="goalkeepers")

    def __init__(self, name, birthday):
        self.name = name
        self.birthday = birthday

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
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
            self.picture
        }
