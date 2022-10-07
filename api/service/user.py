"""User services (add, update, etc.)"""
from bcrypt import checkpw, gensalt, hashpw
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.datastructures import FileStorage
from model.category import Category
from model.user import User
from config.postgres import db
from service.s3 import upload_file

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
    """get user by username
    
    Possible exceptions: SQLAlchemyError
    """
    user:User = User.query.filter_by(username=name).one()
    return user

def get_by_id(user_id):
    """get user by id"""
    try:
        user: User = User.query.filter_by(id=user_id).one()
        return user
    except SQLAlchemyError as err:
        return {"error": str(err)}
    
def verify_user(username, password):
    """Verify if the user exists and has the correct password
    
    Possible exceptions: SQLAlchemyError, PermissionError"""
    
    user: User = get_by_username(username)
    if checkpw(password.encode('utf-8'), user.password.encode('utf-8')) is True:
        return user
    
    raise PermissionError("Could not verify")

def add_category(user: User, category: Category):
    """Add a category to the trainer"""
    user.categories.append(category)
    db.session.commit()

def remove_category(user: User, category: Category):
    """Remove a category from the trainer's list"""
    user.categories.remove(category)
    db.session.commit()

def update_profile_pic(user: User, pic:FileStorage):
    """Set or change the link to the profile pic of the user"""
    pic_url = upload_file(pic, "profile-pics")
    user.profile_pic = pic_url
    db.session.commit()
    return pic_url

def delete_profile_pic(user: User):
    """Removes the profile picture of the user"""
    user.profile_pic = ''
    db.session.commit()
