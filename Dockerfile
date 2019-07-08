FROM node:10

ENV PORT 8080
ENV EVAL_TIMEOUT 60000

WORKDIR /src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./
RUN npm run build

CMD npm run start-server

EXPOSE 8080
