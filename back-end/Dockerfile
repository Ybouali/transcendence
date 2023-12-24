FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npm install argon2

RUN npm install prisma --save-dev

RUN npm install @prisma/client

RUN npx prisma generate

RUN npm run build

ENTRYPOINT [ "npm", "run", "start:prod" ]