"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Date
from sqlalchemy.dialects.postgresql import UUID
from config.postgres import db


class Match(db.Model):
    """Base class for matches"""
    id = Column(UUID(as_uuid=True),
                primary_key=True,
                default=lambda: uuid4().hex)
    date = Column(Date, unique=False, nullable=False)
    local = Column(String(128), unique=False, nullable=False)
    visitor = Column(String(128), unique=False, nullable=False)
    match_type = Column(String(128), unique=False, nullable=False)
    category_id = Column(String(35), db.ForeignKey("category.id"))
    match_category = db.relationship("Category", back_populates="matches")
    goalkeepers_performances = db.relationship("match_monitoring",
                                               back_populates="match")
    result = Column(String(35), unique=False, nullable=True)
    score = Column(String(35), unique=False, nullable=True)

    def __init__(self, date, local, visitor, match_type):
        self.date = date
        self.local = local
        self.visitor = visitor
        self.match_type = match_type

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id':
            self.id,
            'date':
            str(self.date.day) + '/' + str(self.date.month) + '/' +
            str(self.date.year),
            'local':
            self.local,
            'visitor':
            self.visitor,
            'match_type':
            self.match_type
        }
