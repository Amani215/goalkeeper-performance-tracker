"""S3 related services"""
from uuid import uuid4
from werkzeug.datastructures import FileStorage
from config.s3 import s3_client


def upload_file(file: FileStorage, bucket):
    """Add given object to the given bucket"""
    PID = uuid4().hex
    EXTENSION = file.filename.rsplit('.', 1)[1].lower()
    FILENAME = f'{PID}.{EXTENSION}'

    s3_client.upload_fileobj(file.stream, bucket, FILENAME)

    return f'/{bucket}/{FILENAME}'


def upload_local_file(filename: str, filepath: str, bucket):
    """Add given object to the given bucket"""
    s3_client.upload_file(filepath, bucket, filename)

    return f'/{bucket}/{filename}'
