"""imports"""
import os
from uuid import uuid4
from sqlalchemy import Boolean, Column, String, BOOLEAN
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
    first_login = Column(Boolean, unique=False, default=True)
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
        PUBLIC_S3 = os.environ['PUBLIC_S3']
        return {
            'id': self.id,
            'username': self.username,
            'admin': self.admin,
            'profile_pic': f'{PUBLIC_S3}{self.profile_pic}',
            'first_login': self.first_login
        }
