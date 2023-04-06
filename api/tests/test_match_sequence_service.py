'''Testing the match sequence services'''
from helper import random_string
import service.match_sequence as match_sequence_service


def test_add_match_sequence(app, match_monitoring):
    '''Test adding a match sequence'''
    ms = match_sequence_service.add_match_sequence(match_monitoring.id)
    assert ms.id != ''


def test_get_by_id(app, match_sequence):
    '''Test getting match sequence by ID'''
    ms = match_sequence_service.get_by_id(match_sequence.id)
    assert ms.id == match_sequence.id


def test_update_param(app, match_sequence):
    '''Test updating a param of a sequence'''
    new_comment = random_string.generate(10)
    ms = match_sequence_service.update_param(match_sequence.id, 'comment',
                                             new_comment)
    assert ms.id == match_sequence.id
    assert ms.comment == new_comment


def test_delete(app, match_sequence):
    '''Test deleting a match sequence'''
    msid = match_sequence.id
    assert match_sequence_service.get_by_id(msid).id != ''
    match_sequence_service.delete(match_sequence.id)
    assert 'error' in match_sequence_service.get_by_id(msid)