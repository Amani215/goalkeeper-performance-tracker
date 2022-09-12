"""User services (add, update, etc.)"""
from bcrypt import checkpw, gensalt, hashpw
from flask import make_response
from sqlalchemy.exc import SQLAlchemyError
from model.user import User
from app import db

def create_user(username, password):
    """create a new user"""
    password = hashpw(password.encode('utf-8'), gensalt())
    password = password.decode('utf8')
    user = User(username, password)

    try:
        db.session.add(user)
        db.session.commit()
        return {"user_id":user.id}
    except SQLAlchemyError as err:
        error = str(err.__dict__['orig'])
        return {"error":error}

def get_users():
    """get all users"""
    return User.query.all()

def get_by_username(name:str)->User:
    """get user by username"""
    user:User = User.query.filter_by(username=name).one()
    return user

def get_by_id(user_id)->User:
    """get user by id"""
    return User.query.filter_by(id=user_id).one()

def verify_user(username, password):
    """Verify if the user exists and has the correct password"""
    user: User = get_by_username(username)
    if checkpw(password.encode('utf-8'), user.password.encode('utf-8')) is True:
        return user
    return make_response('Could not verify',  401, {'Authentication': '"login required"'})
