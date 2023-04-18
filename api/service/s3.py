"""S3 related services"""
from os import environ
from uuid import uuid4
from werkzeug.datastructures import FileStorage
from config.s3 import s3_client

def upload_file(file: FileStorage, bucket):
    """Add given object to the given bucket"""
    PID = uuid4().hex
    EXTENSION = file.filename.rsplit('.', 1)[1].lower()
    FILENAME = f'{PID}.{EXTENSION}'
    
    s3_client.upload_fileobj(file.stream, bucket, FILENAME)
    
    PUBLIC_S3 = environ['PUBLIC_S3']
    return f'{PUBLIC_S3}/{bucket}/{FILENAME}'