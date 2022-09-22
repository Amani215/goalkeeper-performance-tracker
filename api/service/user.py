"""User services (add, update, etc.)"""
from bcrypt import checkpw, gensalt, hashpw
from flask import make_response
from sqlalchemy.exc import SQLAlchemyError
from model.user import User
from model import db

def add_user(username, password):
    """adds a new user to the database"""
    if len(username)<4:
        raise ValueError("username too short")
    elif len(username)>50:
        raise ValueError("username too long")

    elif len(password)<6:
        raise ValueError("password too short")
    elif len(password)>50:
        raise ValueError("password too long")
    
    password = hashpw(password.encode('utf-8'), gensalt())
    password = password.decode('utf8')
    user = User(username, password)

    db.session.add(user)
    db.session.commit()
    return {"user_id":user.id}

def get_users():
    """get all users"""
    return User.query.all()

def get_by_username(name:str):
    """get user by username"""
    try:
        user:User = User.query.filter_by(username=name).one()
        return user
    except SQLAlchemyError as err:
        return {"error": str(err)}

def get_by_id(user_id):
    """get user by id"""
    try:
        user: User = User.query.filter_by(id=user_id).one()
        return user
    except SQLAlchemyError as err:
        return {"error": str(err)}
    
def verify_user(username, password):
    """Verify if the user exists and has the correct password"""
    
    user: User = get_by_username(username)
    if checkpw(password.encode('utf-8'), user.password.encode('utf-8')) is True:
        return user
    return {"error":"Could not verify"}
