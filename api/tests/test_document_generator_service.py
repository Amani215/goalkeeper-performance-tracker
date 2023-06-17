'''Testing the document generation service'''
from os import getenv
import service.document_generator as document_generator_service


def test_goalkeepers_per_category(app, category):
    '''test the generation of the goalkeepers files'''
    response = document_generator_service.goalkeepers_per_category(
        category.id, 'en')
    assert str(getenv('PUBLIC_S3')) in response
    assert category.id in response

    response = document_generator_service.goalkeepers_per_category(
        category.id, 'fr')
    assert str(getenv('PUBLIC_S3')) in response
    assert category.id in response