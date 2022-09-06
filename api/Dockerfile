FROM python:3.9-alpine3.15
RUN apk add build-base

WORKDIR /var/www/app

COPY ./requirements.txt .
RUN pip install -r requirements.txt
# RUN \
#  apk add --no-cache postgresql-libs && \
#  apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
#  python3 -m pip install -r requirements.txt --no-cache-dir && \
#  apk --purge del .build-deps

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]