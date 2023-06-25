'''Testing the Planning services'''
import service.planning as planning_service
from helper import random_date, random_string


def test_add_planning(app, category):
    '''Test adding a planning for an existing category'''
    plannings = category.plannings
    planning_count = len([i.serialize for i in plannings])

    date = random_date.generate()
    planning_service.add_planning(category.id, date.strftime('%d/%m/%Y'),
                                  random_string.generate(4))

    plannings = category.plannings
    assert len([i.serialize for i in plannings]) == planning_count + 1
