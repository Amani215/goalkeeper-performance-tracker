"""User services (add, update, etc.)"""
from bcrypt import checkpw, gensalt, hashpw
from flask import make_response
from sqlalchemy.exc import SQLAlchemyError
from model.user import User
from model import db

def add_user(username, password):
    """adds a new user to the database"""
    try:
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
    
    except (SQLAlchemyError, ValueError) as err:
        return {"error":str(err)}

def get_users():
    """get all users"""
    return User.query.all()

def get_by_username(name:str)->User:
    """get user by username"""
    user:User = User.query.filter_by(username=name).one()
    return user

def get_by_id(user_id):
    """get user by id"""
    user = User.query.filter_by(id=user_id).one()
    if not user:
        raise ValueError("Invalid user ID")
    return user

def verify_user(username, password):
    """Verify if the user exists and has the correct password"""
    user: User = get_by_username(username)
    if checkpw(password.encode('utf-8'), user.password.encode('utf-8')) is True:
        return user
    return make_response('Could not verify',  401, {'Authentication': '"login required"'})
