"""Authentication and Authorization services"""
import os.path
from dotenv import load_dotenv
import jwt
from model.user import User
from schema.token import TokenSchema
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
        user: User = result
        return {'token': token.decode('utf-8'), 'user': user.serialize}

    except SQLAlchemyError as err:
        raise SQLAlchemyError(str(err))
    except PermissionError as err:
        raise PermissionError(str(err))


def get_authenticated_user(bearer_token: str):
    """get the current user from the given token
    
    Possible Exceptions: ValueError, jwt.InvalidSignatureError, jwt.exceptions.DecodeError"""

    [bearer, token] = bearer_token.split(" ")
    if bearer.upper() != "BEARER":
        raise ValueError("Token is not Bearer token")

    load_dotenv()
    token_dict: dict = jwt.decode(token, os.getenv('SECRET_KEY'), True,
                                  ["HS256"])
    token_schema: TokenSchema = TokenSchema().from_dict(token_dict)

    user_id = token_schema.public_id
    return get_by_id(user_id)
