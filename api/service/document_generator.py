'''Service that generates documents from given templates'''

from flask import render_template
import service.category as category_service


def test_doc(category_id: str):
    category = category_service.get_by_id(category_id)
    goalkeepers = category_service.get_category_goalkeepers(category_id)
    return render_template("goalkeepers.html",
                           category=category,
                           goalkeepers=goalkeepers)
