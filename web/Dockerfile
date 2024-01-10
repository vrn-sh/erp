FROM node:hydrogen-alpine3.17 as web-build

COPY package.json .
RUN yarn

COPY . .

RUN cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib ./public/pspdfkit-lib && yarn build

FROM nginx:stable-alpine3.17 as run
RUN apk update && apk upgrade

COPY --from=web-build /dist /usr/share/nginx/html
COPY --from=web-build ./node_modules/pspdfkit/dist/ /usr/share/html/assets/pspdfkit-lib
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
