"""imports"""
import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
# from app import db
from model import db

class User(db.Model):
    """Base class for all types of available users"""
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(128), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password  = password

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id'  : self.id,
            'username': self.username
        }

    def check_password(self, _password):
        """Check if password is good enough"""
        return False
