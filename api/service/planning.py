'''Planning Services'''
from datetime import datetime

from config import db
from model.planning import Planning
import service.category as category_service


def add_planning(category_id: str, date: str, type: str) -> Planning:
    '''Add a planning record to the given category'''
    _date = datetime.strptime(date, '%d/%m/%Y')
    category = category_service.get_by_id(category_id)

    planning = Planning(category, _date, type)

    db.session.add(planning)
    db.session.commit()

    return planning
