from config import db
from sqlalchemy import String

trainer_categories = db.Table(
    'category_trainers',
    db.Column('user_id', String, db.ForeignKey('user.id'), primary_key=True),
    db.Column('category_id',
              String,
              db.ForeignKey('category.id'),
              primary_key=True))

goalkeeper_categories = db.Table(
    'category_goalkeepers',
    db.Column('goalkeeper_id',
              String,
              db.ForeignKey('goalkeeper.id'),
              primary_key=True),
    db.Column('category_id',
              String,
              db.ForeignKey('category.id'),
              primary_key=True))
