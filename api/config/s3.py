"""Init S3 resource"""
import boto3
import os

s3_resource  = boto3.resource('s3', 
    endpoint_url=os.getenv('AWS_DOMAIN'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=None,
    config=boto3.session.Config(signature_version='s3v4'),
    verify=False
)

s3_client  = boto3.client('s3', 
    endpoint_url=os.getenv('AWS_DOMAIN'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=None,
    config=boto3.session.Config(signature_version='s3v4'),
    verify=False
)
