from config.postgres import db
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String

trainer_categories = db.Table(
    'category_trainers',
    db.Column('user_id',
              UUID(as_uuid=True),
              db.ForeignKey('user.id'),
              primary_key=True),
    db.Column('category_id',
              String,
              db.ForeignKey('category.id'),
              primary_key=True))
