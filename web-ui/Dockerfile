FROM node:16.17.0-alpine3.15 as build
WORKDIR /app
COPY package*.json .
COPY yarn.lock .
RUN yarn install --production
COPY . .
RUN yarn build

FROM nginx:1.15
COPY --from=build /app/build/ /usr/share/nginx/html

