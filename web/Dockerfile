FROM node:hydrogen-alpine3.17 as build

RUN mkdir -p /voronsh
WORKDIR /voronsh

COPY package.json .
RUN yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine3.17 as run
RUN apk update
RUN apk upgrade
COPY --from=build /app/client/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
