'''Service that generates documents from given templates'''
from os import getenv
import pdfkit
from flask import render_template
import service.category as category_service
from service.s3 import upload_local_file


def goalkeepers_per_category(category_id: str) -> str:
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
