"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, BOOLEAN
from sqlalchemy.dialects.postgresql import UUID
from config.postgres import db
from model.category import Category

trainer_categories = db.Table('category_trainers',
    db.Column('user_id', UUID(as_uuid=True), db.ForeignKey('user.id'), primary_key=True),
    db.Column('category_id', String, db.ForeignKey('category.id'), primary_key=True)
)

class User(db.Model):
    """Base class for all types of available users"""
    id = Column(UUID(as_uuid=True), primary_key=True, default=lambda: uuid4().hex)
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    admin = Column(BOOLEAN, nullable=False, default=False)
    profile_pic = Column(String(128), unique=False, nullable=True)
    categories = db.relationship('Category',
                                 secondary=trainer_categories, 
                                 lazy='subquery',
                                 backref=db.backref('trainers', lazy=True))

    def __init__(self, username, password, admin):
        self.username = username
        self.password  = password
        self.admin = admin
    
    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id'  : self.id,
            'username': self.username,
            'admin': self.admin,
            'profile_pic': self.profile_pic
        }
