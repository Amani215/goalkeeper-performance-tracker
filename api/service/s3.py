"""S3 related services"""
from config.s3 import s3_client

def upload_file(file, bucket="profile-pics", object="test"):
    """Add given object to the given bucket"""
    s3_client.upload_fileobj(file, bucket, object)
