"""Authentication and Authorization services"""
import os.path
from flask import jsonify
from dotenv import load_dotenv
import jwt
from schema.token import TokenSchema
from model.user import User
from service.user import verify_user, get_by_id
from sqlalchemy.exc import SQLAlchemyError

def authenticate_user(username, password):
    """Authenticate the user with the given username and password
    
    Possible exceptions: SQLAlchemyError, PermissionError"""
    
    try:
        result = verify_user(username, password)

        load_dotenv()
        token_schema = TokenSchema(str(result.id)).serialize
        token = jwt.encode(token_schema, os.getenv('SECRET_KEY'), "HS256")
        return {'token': token.decode('utf-8')}
        
    except SQLAlchemyError as err:
        raise SQLAlchemyError(str(err))
    except PermissionError as err:
        raise PermissionError(str(err))


def get_authenticated_user(bearer_token: str):
    """get the current user from the given token"""
    [bearer, token] = bearer_token.split(" ")
    if bearer.upper() != "BEARER":
        raise ValueError("Token is not Bearer token")

    try:
        load_dotenv()
        token_dict: dict = jwt.decode(token, os.getenv('SECRET_KEY'), True,
                                      ["HS256"])
        token_schema: TokenSchema = TokenSchema().from_dict(token_dict)
    except (jwt.InvalidSignatureError, jwt.exceptions.DecodeError) as err:
        return {"error": str(err)}

    user_id = token_schema.public_id
    return get_by_id(user_id)
