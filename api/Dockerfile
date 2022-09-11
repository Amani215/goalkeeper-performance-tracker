FROM python:3.9-alpine3.15
RUN apk add --no-cache build-base=0.5-r3
RUN apk add --no-cache postgresql-libs
RUN apk add --no-cache --virtual .build-deps gcc=10.3.1_git20211027-r0 musl-dev=1.2.2-r7 postgresql14-dev=14.5-r0

WORKDIR /var/www/app

COPY ./requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]