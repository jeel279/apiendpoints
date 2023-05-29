FROM node:20-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait


ENV WAIT_TIMEOUT="60000"

RUN chmod +x /wait


CMD /wait && npm start
