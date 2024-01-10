FROM node:hydrogen-alpine3.17 as web-build

COPY package.json .
RUN yarn

COPY . .

RUN cp -R ./node_modules/pspdfkit/dist assets

RUN yarn build

FROM nginx:stable-alpine3.17 as run
RUN apk update && apk upgrade

COPY --from=web-build /dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
