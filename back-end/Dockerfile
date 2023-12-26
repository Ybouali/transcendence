FROM node:latest

WORKDIR /app

COPY package*.json .



RUN npm install 

COPY . .

RUN npx prisma generate

ENTRYPOINT [ "npm", "run", "start:dev" ]
# ENTRYPOINT [ "tail", "-f" ]

# RUN npm install argon2

# RUN npm install prisma --save-dev

# RUN npm install @prisma/client





# RUN npm run build

# ENTRYPOINT [ "npm", "run", "start:prod" ]