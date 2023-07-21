'''User services (add, update, etc.)'''
import os
from bcrypt import checkpw, gensalt, hashpw
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.datastructures import FileStorage
from model.category import Category
from model.user import User
from config import db
from service.s3 import upload_file
from config.redis import redis_db


def add_user(username: str, password: str, admin: bool):
    '''adds a new user to the database'''
    if len(username) < 4:
        raise ValueError('username too short')
    elif len(username) > 50:
        raise ValueError('username too long')

    elif len(password) < 6:
        raise ValueError('password too short')
    elif len(password) > 50:
        raise ValueError('password too long')

    password = hashpw(password.encode('utf-8'), gensalt())
    password = password.decode('utf8')
    user = User(username, password, admin)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    '''get all users'''
    return User.query.all()


def get_by_username(name: str):
    '''get user by username
    
    Possible exceptions: SQLAlchemyError
    '''
    user: User = User.query.filter_by(username=name).one()
    return user


def get_by_id(user_id):
    '''get user by id'''
    try:
        user: User = User.query.filter_by(id=user_id).one()
        return user
    except SQLAlchemyError as err:
        return {'error': str(err)}


def get_by_archived(archived: bool):
    '''Get users given their archived attribute'''
    try:
        return User.query.filter_by(archived=archived)
    except SQLAlchemyError as err:
        return {'error': str(err)}


def verify_user(username: str, password: str):
    '''Verify if the user exists and has the correct password
    
    Possible exceptions: SQLAlchemyError, PermissionError'''

    user: User = get_by_username(username)
    if checkpw(password.encode('utf-8'),
               user.password.encode('utf-8')) is True:
        return user

    raise PermissionError('Could not verify')


def set_admin(username: str, admin: bool):
    '''Update the admin status of the user'''
    if username == os.environ['ADMIN_USERNAME']:
        raise PermissionError('Default admin cannot be changed')

    user = get_by_username(username)
    user.admin = admin
    db.session.commit()

    return user


def set_password(user_id, password: str):
    '''Set a new password for the given user'''
    user = get_by_id(user_id)

    if len(password) < 6:
        raise ValueError('password too short')
    elif len(password) > 50:
        raise ValueError('password too long')

    password = hashpw(password.encode('utf-8'), gensalt())
    password = password.decode('utf8')

    user.password = password
    user.first_login = False

    db.session.commit()
    return user


def set_archived(username: str, archived: bool, reason: str):
    '''Update the archived status of the user and its reason'''
    if username == os.environ['ADMIN_USERNAME']:
        raise PermissionError('Default admin cannot be changed')

    user = get_by_username(username)
    user.archived = archived
    user.archive_reason = reason
    db.session.commit()

    return user


def get_categories(user_id):
    '''Get categories of the given user'''
    try:
        user: User = User.query.filter_by(id=user_id).one()
        return user.categories
    except SQLAlchemyError as err:
        return {'error': str(err)}


def add_category(user: User, category: Category):
    '''Add a category to the trainer'''
    user.categories.append(category)
    db.session.commit()
    for goalkeeper in category.goalkeepers:
        key = f'{goalkeeper.id}_editable'
        redis_db.delete(key)
    return {'user_id': user.id, 'category_id': category.id}


def remove_category(user: User, category: Category):
    '''Remove a category from the trainer's list'''
    user.categories.remove(category)
    db.session.commit()
    for goalkeeper in category.goalkeepers:
        key = f'{goalkeeper.id}_editable'
        redis_db.delete(key)

        for mm in goalkeeper.match_performances:
            key = f'{mm.id}_editable'
            redis_db.delete(key)

        for tm in goalkeeper.training_performances:
            key = f'{tm.id}_editable'
            redis_db.delete(key)


def update_profile_pic(user: User, pic: FileStorage):
    '''Set or change the link to the profile pic of the user'''
    pic_url = upload_file(pic, os.getenv('PROFILE_PICS_BUCKET'))
    user.profile_pic = pic_url
    db.session.commit()
    return pic_url


def delete_profile_pic(user: User):
    '''Removes the profile picture of the user'''
    user.profile_pic = ''
    db.session.commit()
