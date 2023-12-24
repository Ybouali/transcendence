FROM node:latest

WORKDIR /app

RUN mkdir -p /app/env/

COPY package*.json .

RUN npm install 

COPY . .

RUN npm install argon2

RUN npm install prisma --save-dev

RUN npm install @prisma/client

RUN npx prisma generate

# CMD [ "tail", "-f" ]

ENTRYPOINT [ "npm", "run", "start:prod" ]

# RUN chmod 777 script/script.sh

# ENTRYPOINT ["script/script.sh"]