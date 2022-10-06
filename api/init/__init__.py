"""Init the S3 buckets if they do not exist yet"""
from botocore.client import ClientError
from config.s3 import s3_client

def create_buckets():
    try:
        s3_client.create_bucket(Bucket="profile-pics")
    except ClientError as err:
        print('error:', err)
