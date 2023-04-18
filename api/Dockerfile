FROM python:3.9-alpine3.15

RUN apk add --no-cache build-base=0.5-r3

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

WORKDIR /var/www/app

COPY ./requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]