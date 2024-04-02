FROM node:16

WORKDIR /artinfo/
COPY . /artinfo/

EXPOSE 3000

RUN yarn install
RUN yarn run build

CMD yarn run start
