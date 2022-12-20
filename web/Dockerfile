FROM node:14.18.0-alpine3.12

RUN mkdir -p /moron
WORKDIR /moron

COPY package.json .
RUN yarn global add react-scripts serve && \
    yarn install

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["serve", "-s" , "dist"]

