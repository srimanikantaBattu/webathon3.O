FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -f

COPY . .

EXPOSE 4000

CMD ["node", "server.js"] 