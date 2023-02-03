"""imports"""
from uuid import uuid4
from sqlalchemy import Column, String, Date, Integer
from sqlalchemy.dialects.postgresql import UUID
from config import db


class Match(db.Model):
    """Base class for matches"""
    id = Column(String(128),
                primary_key=True,
                default=lambda: str(uuid4().hex))
    date = Column(Date, unique=False, nullable=False)
    local = Column(String(128), unique=False, nullable=False)
    visitor = Column(String(128), unique=False, nullable=False)
    match_type = Column(String(128), unique=False, nullable=False)
    category_id = Column(String(35), db.ForeignKey("category.id"))
    match_category = db.relationship("Category", back_populates="matches")
    goalkeepers_performances = db.relationship("match_monitoring",
                                               back_populates="match")
    result = Column(String(35), unique=False, nullable=True)
    score_local = Column(Integer, unique=False, default=0)
    score_visitor = Column(Integer, unique=False, default=0)

    def __init__(self, date, local, visitor, match_type, category):
        self.date = date
        self.local = local
        self.visitor = visitor
        self.match_type = match_type
        self.match_category = category
        self.category_id = category.id

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            'id':
            self.id,
            'category':
            self.match_category.serialize,
            'date':
            str(self.date.day) + '/' + str(self.date.month) + '/' +
            str(self.date.year),
            'local':
            self.local,
            'visitor':
            self.visitor,
            'match_type':
            self.match_type,
            'score_local':
            self.score_local,
            'score_visitor':
            self.score_visitor
        }
