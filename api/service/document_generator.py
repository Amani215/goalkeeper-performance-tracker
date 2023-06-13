'''Service that generates documents from given templates'''
from os import getenv
from time import strftime
import pdfkit
from flask import render_template
import service.category as category_service
from service.s3 import upload_local_file


def goalkeepers_per_category(category_id: str) -> str:
    '''Generate a document of all goalkeepers in the given category'''
    category = category_service.get_by_id(category_id)
    goalkeepers = category_service.get_category_goalkeepers(category_id)
    output_text = render_template("goalkeepers.html",
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
    return {
        'link': str(getenv('PUBLIC_S3')) + url,
        'uploaded_at': strftime('%H:%M:%S')
    }


def attendance(category_id: str, lang: str, force: bool = False):
    '''Either force the generation of a new attendance sheet or get the latest one'''
    if force:
        return generate_attendance(category_id, lang)

    return {
        'link':
        str(getenv('PUBLIC_S3')) + '/' + str(getenv('DOCUMENTS_BUCKET')) +
        f'/{category_id}_attendance_{lang}.pdf',
        'uploaded_at': ''
    }
