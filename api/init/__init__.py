"""Init the S3 buckets if they do not exist yet"""
import os
from botocore.client import ClientError
from config.s3 import s3_client

def create_buckets():
    try:
        s3_client.create_bucket(Bucket=os.getenv('PROFILE_PICS_BUCKET'))
    except ClientError as err:
        print('error:', err)
