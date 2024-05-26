FROM node:21.6.2-alpine3.19 as webui
WORKDIR /app
COPY web-ui/package*.json .
COPY web-ui/yarn.lock .
RUN yarn install --production
COPY web-ui .
ENV DISABLE_ESLINT_PLUGIN=true
ARG GRAFANA_ENDPOINT_PROD
ENV REACT_APP_GRAFANA_ENDPOINT ${GRAFANA_ENDPOINT_PROD}
RUN yarn build

FROM squidfunk/mkdocs-material:9 as mkdocs
WORKDIR /app
COPY ./docs/ ./docs/
COPY mkdocs.yml .
RUN python -m mkdocs build -d ./build

FROM python:3.10.12-alpine3.18
RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot
USER nonroot
WORKDIR /var/www/app
COPY api/requirements.txt .
RUN pip install  --no-cache-dir -r requirements.txt
COPY --chown=nonroot:nonroot api .
COPY --from=webui --chown=nonroot:nonroot /app/build/ ./static
COPY --from=mkdocs --chown=nonroot:nonroot /app/build/ ./static/docs/
EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
