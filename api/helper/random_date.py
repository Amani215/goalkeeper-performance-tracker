from datetime import datetime
import random


def generate(start: str = '01/01/1970', end: str = '31/12/2100') -> datetime:
    '''Generate a random date'''
    start_date = datetime.strptime(start, '%d/%m/%Y')
    end_date = datetime.strptime(end, '%d/%m/%Y')
    random.seed()
    random_date_int = random.uniform(end_date.timestamp(),
                                     start_date.timestamp())
    random_date = datetime.utcfromtimestamp(random_date_int)
    return random_date


def generate_with_time(start: str = '01/01/1970 00:00',
                       end: str = '31/12/2100 23:59') -> datetime:
    '''Generate a random date with time'''
    start_date = datetime.strptime(start, '%d/%m/%Y %H:%M')
    end_date = datetime.strptime(end, '%d/%m/%Y %H:%M')
    random.seed()
    random_date_int = random.uniform(end_date.timestamp(),
                                     start_date.timestamp())
    random_date = datetime.utcfromtimestamp(random_date_int)
    return random_date