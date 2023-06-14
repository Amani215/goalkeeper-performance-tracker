'''Service that generates documents from given templates'''
from os import getenv
from time import strftime
import pdfkit
from flask import render_template
import service.category as category_service
from service.s3 import upload_local_file


def goalkeepers_per_category(category_id: str, lang: str) -> str:
    '''Generate a document of all goalkeepers in the given category'''
    category = category_service.get_by_id(category_id)
    goalkeepers = category_service.get_category_goalkeepers(category_id)

    template = f'/{lang}/goalkeepers.html'
    output_text = render_template(template,
                                  category=category,
                                  goalkeepers=goalkeepers,
                                  s3_url=getenv('PRIVATE_S3'))

    pdfkit.from_string(output_text, f"/tmp/{category_id}.pdf")
    url = upload_local_file(f"{category_id}.pdf", f"/tmp/{category_id}.pdf",
                            getenv('DOCUMENTS_BUCKET'))
    return str(getenv('PUBLIC_S3')) + url


def generate_attendance(category_id: str, lang: str):
    '''Generate a document with the attendance of every goalkeeper in a category'''
    category = category_service.get_by_id(category_id)

    total_sessions = 0
    total_time = 0
    stats = {}
    for ts in category.training_sessions:
        total_sessions += 1
        total_time += ts.duration
        for g in ts.goalkeepers_performances:
            if category in g.goalkeeper.categories:
                if g.goalkeeper.name not in stats:
                    stats[g.goalkeeper.name] = {
                        'with_national_team': 0,
                        'other_category': 0,
                        'with_the_team': 0,
                        'absent': 0,
                        'authorized': 0,
                        'with_seniors': 0,
                        'hurt': 0,
                        'present': 0
                    }
                attendance = g.attendance.lower().replace(' ', '_')
                if attendance in stats[g.goalkeeper.name]:
                    stats[g.goalkeeper.name][attendance] += 1

    template = f'/{lang}/attendance.html'
    output_text = render_template(template,
                                  category=category,
                                  stats=stats,
                                  total_time=total_time,
                                  total_sessions=total_sessions)

    pdfkit.from_string(output_text, f"/tmp/{category_id}.pdf")
    url = upload_local_file(f'{category_id}_attendance_{lang}.pdf',
                            f'/tmp/{category_id}.pdf',
                            getenv('DOCUMENTS_BUCKET'))

    # Adding strftime at the end is important to avoid cached documents on the browser.
    return {
        'link': str(getenv('PUBLIC_S3')) + url + '?_=' + strftime('%H%M%S')
    }


def attendance(category_id: str, lang: str, force: bool = False):
    '''Either force the generation of a new attendance sheet or get the latest one'''
    if force:
        return generate_attendance(category_id, lang)

    return {
        'link':
        str(getenv('PUBLIC_S3')) + '/' + str(getenv('DOCUMENTS_BUCKET')) +
        f'/{category_id}_attendance_{lang}.pdf' + '?_=' + strftime('%H%M%S')
    }


def generate_matches_details(category_id: str, lang: str):
    ''''''
    category = category_service.get_by_id(category_id)

    lose_count = 0
    win_count = 0
    nul_count = 0
    goals_conceded_with_penalty = 0
    penalties_saved = 0
    goals_scored = 0
    penalties_conceded = 0
    matches = {}
    for m in category.matches:
        for g in m.goalkeepers_performances:
            matches[m.match_type] = {}
            matches[m.match_type][m.id] = {
                'goalkeeper_order': g.goalkeeper_order,
                'goalkeeper_name': g.main_goalkeeper.name,
                'date': m.date.strftime("%d/%m/%Y"),
                'local': m.local,
                'visitor': m.visitor,
                'time_played': g.time_played,
                'replaced_by': '',
                'goals_scored': g.goals_scored,
                'goals_conceded': g.goals_conceded,
                'penalties_saved': g.penalties_saved,
                'penalties_conceded': g.penalties_non_saved,
                'result': str(m.score_local) + '-' + str(m.score_visitor)
            }
            goals_conceded_with_penalty += g.goals_conceded + g.penalties_non_saved
            penalties_saved += g.penalties_saved
            penalties_conceded += g.penalties_non_saved
            goals_scored += g.goals_scored

    template = f'/{lang}/played_matches_details.html'
    output_text = render_template(
        template,
        category=category,
        matches=matches,
        lose_count=lose_count,
        win_count=win_count,
        nul_count=nul_count,
        goals_conceded_with_penalty=goals_conceded_with_penalty,
        penalties_saved=penalties_saved,
        goals_scored=goals_scored,
        penalties_conceded=penalties_conceded)

    pdfkit.from_string(output_text, f"/tmp/{category_id}.pdf")
    url = upload_local_file(f'{category_id}_matches_{lang}.pdf',
                            f'/tmp/{category_id}.pdf',
                            getenv('DOCUMENTS_BUCKET'))

    # Adding strftime at the end is important to avoid cached documents on the browser.
    return {
        'link': str(getenv('PUBLIC_S3')) + url + '?_=' + strftime('%H%M%S')
    }


def matches_details(category_id: str, lang: str, force: bool = False):
    '''Either force the generation of a new matches details sheet or get the latest one'''
    if force:
        return generate_matches_details(category_id, lang)

    return {
        'link':
        str(getenv('PUBLIC_S3')) + '/' + str(getenv('DOCUMENTS_BUCKET')) +
        f'/{category_id}_matches_{lang}.pdf' + '?_=' + strftime('%H%M%S')
    }
