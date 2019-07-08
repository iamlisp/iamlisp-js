FROM node:10

WORKDIR /src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm i
RUN npm build

CMD npm run start-server
