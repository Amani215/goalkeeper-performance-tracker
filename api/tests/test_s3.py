"""Testing S3 services"""
from werkzeug.datastructures import FileStorage
from service.s3 import upload_file

def test_file_upload(bucket):
    """Test if the file gets uploaded successfully"""
    
    with open('tests/assets/image.jpeg', 'rb')as f:
        upload_file(FileStorage(f), bucket.name)
        
    assert sum(1 for _ in bucket.objects.all()) == 1
