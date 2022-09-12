"""Decorator"""
from functools import wraps
from http.client import UNAUTHORIZED
from flask import jsonify, request
import service.auth as auth_service

def token_required(func):
    """decorator for required JWT. This will be used in routes that require an authorized user"""
    @wraps(func)
    def decorator(*args, **kwargs):
        try:
            if ('Authorization' not in request.headers) or (not request.headers['Authorization']):
                raise ValueError("A valid token is missing")

            token = request.headers['Authorization']

            current_user = auth_service.get_authorized_user(token)
        except ValueError as err:
            return jsonify({'message': str(err)}), UNAUTHORIZED

        return func(current_user, *args, **kwargs)
    return decorator
