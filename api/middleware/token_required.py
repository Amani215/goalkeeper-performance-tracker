"""Decorator"""
from functools import wraps
from flask import request
import service.auth as auth_service


def token_required(func):
    """decorator for required JWT. This will be used in routes that require an authorized user"""

    @wraps(func)
    def decorator(*args, **kwargs):
        try:
            if ('Authorization' not in request.headers) or (
                    not request.headers['Authorization']):
                raise ValueError("A valid token is missing")

            token = request.headers['Authorization']
            current_user = auth_service.get_authenticated_user(token)

            if current_user == {}:
                raise PermissionError("Could not verify user")
            
        except ValueError as err:
            return {'error': str(err)}, 401
        except Exception as err:
            return {"error": str(err)}, 400

        return func(current_user, *args, **kwargs)

    return decorator
