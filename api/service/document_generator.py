'''Service that generates documents from given templates'''

from flask import render_template
from service.goalkeeper import get_goalkeepers


def test_doc():
    goalkeepers = get_goalkeepers()
    return render_template("goalkeepers.html", goalkeepers=goalkeepers)
