"""Decorator"""
from functools import wraps
from flask import request
import service.auth as auth_service

def token_required(admin):
    def inner_decorator(f):
        def wrapped(*args, **kwargs):
            try:
                if ('Authorization' not in request.headers) or (
                        not request.headers['Authorization']):
                    raise ValueError("A valid token is missing")

                token = request.headers['Authorization']
                current_user = auth_service.get_authenticated_user(token)

                if current_user == {}:
                    raise PermissionError("Could not verify user")
                elif (current_user.admin == False and admin == True):
                    raise PermissionError("User is not an admin")
            
            except ValueError as err:
                return {'error': str(err)}, 401
            except Exception as err:
                return {"error": str(err)}, 400

            return f(current_user, *args, **kwargs)
        wrapped.__name__ = f.__name__
        return wrapped
    return inner_decorator
