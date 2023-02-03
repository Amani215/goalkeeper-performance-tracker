"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, BOOLEAN
# from sqlalchemy.dialects.postgresql import UUID
from config import db
from model.association_tables import trainer_categories


class User(db.Model):
    """Base class for all types of available users"""
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    admin = Column(BOOLEAN, nullable=False, default=False)
    profile_pic = Column(String(128), unique=False, nullable=True)
    categories = db.relationship('Category',
                                 secondary=trainer_categories,
                                 lazy='subquery',
                                 back_populates="trainers")

    def __init__(self, username, password, admin):
        self.username = username
        self.password = password
        self.admin = admin

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id': self.id,
            'username': self.username,
            'admin': self.admin,
            'profile_pic': self.profile_pic
        }
