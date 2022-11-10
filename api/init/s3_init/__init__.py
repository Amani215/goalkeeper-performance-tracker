"""Init the S3 buckets if they do not exist yet"""
import json
import os
from botocore.client import ClientError
from config.s3 import s3_client


def create_bucket(bucket_name: str):
    bucket_policy = {
        'Version':
        '2012-10-17',
        'Statement': [{
            'Sid': 'AddPerm',
            'Effect': 'Allow',
            'Principal': '*',
            'Action': ['s3:GetObject'],
            'Resource': f'arn:aws:s3:::{bucket_name}/*'
        }]
    }
    bucket_policy = json.dumps(bucket_policy)
    s3_client.create_bucket(Bucket=bucket_name)
    s3_client.put_bucket_policy(Bucket=bucket_name, Policy=bucket_policy)


def create_buckets():
    try:
        create_bucket(os.environ['TRAINING_FORMS_BUCKET'])
        create_bucket(os.environ['GOALKEEPER_PICS_BUCKET'])
        create_bucket(os.environ['PROFILE_PICS_BUCKET'])
    except ClientError as err:
        print('error:', err)
