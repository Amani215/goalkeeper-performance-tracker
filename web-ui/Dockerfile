FROM node:16.17.0-alpine3.15 as build
WORKDIR /app
COPY package*.json .
COPY yarn.lock .
RUN yarn install --production
COPY . .
RUN yarn build

FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build/ .
ENTRYPOINT ["nginx", "-g", "daemon off;"]


