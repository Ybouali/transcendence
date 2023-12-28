FROM node:latest

WORKDIR /app

COPY package*.json .



RUN npm install 

COPY . .

RUN chmod 777 script/script.sh

ENTRYPOINT [ "script/script.sh" ]

# ENTRYPOINT [ "npm", "run", "start:dev" ]