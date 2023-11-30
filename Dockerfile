FROM node:16

WORKDIR /artinfo/
COPY ./package.json /artinfo/
COPY ./yarn.lock /artinfo/
RUN yarn install

COPY . /artinfo/

RUN yarn run build
CMD yarn run start