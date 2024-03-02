FROM node:21.6.2-alpine3.19 as webui
WORKDIR /app
COPY web-ui/package*.json .
COPY web-ui/yarn.lock .
RUN yarn install --production
COPY web-ui .
ENV DISABLE_ESLINT_PLUGIN=true
RUN yarn build

FROM python:3.10.12-alpine3.18
# RUN apk add --no-cache build-base=0.5-r3\
#     && apk add --no-cache --virtual .build-deps gcc=10.3.1_git20211027-r0 musl-dev=1.2.2-r7 postgresql14-dev=14.5-r0
RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot
USER nonroot
WORKDIR /var/www/app
COPY api/requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt
COPY --chown=nonroot:nonroot api .
COPY --from=webui --chown=nonroot:nonroot /app/build/ ./static
EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
