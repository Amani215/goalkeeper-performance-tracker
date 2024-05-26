"""S3 related services"""
from uuid import uuid4
from werkzeug.datastructures import FileStorage
from config.s3 import s3_client


def upload_file(file: FileStorage, bucket, prefix: str):
    """Add given object to the given bucket"""
    PID = uuid4().hex
    EXTENSION = file.filename.rsplit('.', 1)[1].lower()
    FILENAME = f'{prefix}_{PID}.{EXTENSION}'

    s3_client.upload_fileobj(file.stream, bucket, FILENAME)

    return f'/{bucket}/{FILENAME}'


def upload_local_file(filename: str, filepath: str, bucket):
    """Add a file from the local files in the project.
    If the file exists in the given bucket, it will be replaced."""
    s3_client.upload_file(filepath, bucket, filename)

    return f'/{bucket}/{filename}'
