import os
import service.user as user_service

def set_default_user():
    try:
        user_service.add_user(os.environ['ADMIN_USERNAME'], os.environ['ADMIN_PASSWORD'], True)
    except Exception as err:
        print('error: ', err)