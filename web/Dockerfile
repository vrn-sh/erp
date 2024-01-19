FROM node:hydrogen-alpine3.17 as web-build

COPY package.json .
RUN yarn

COPY . .

# RUN cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib ./public/pspdfkit-lib
RUN yarn build

FROM nginx:stable-alpine3.17 as run
RUN apk update && apk upgrade

COPY --from=web-build /dist /usr/share/nginx/html
# COPY --from=web-build ./node_modules/pspdfkit/dist/pspdfkit-lib /usr/share/html/assets/.
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# RUN cp -r /usr/share/nginx/html/pspdfkit-lib /usr/share/nginx/html/assets/.

EXPOSE 3000
