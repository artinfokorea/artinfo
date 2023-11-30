FROM node:16

WORKDIR /artinfo/
COPY . /artinfo/

RUN yarn install
RUN yarn run build

CMD yarn run start