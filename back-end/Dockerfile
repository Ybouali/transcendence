FROM node:16

WORKDIR /app

RUN mkdir -p /app/env/

COPY package*.json .

RUN npm install 

COPY . .

RUN chmod 777 script/script.sh

ENTRYPOINT [ "script/script.sh" ]

# RUN npm run build

# ENTRYPOINT ["npm", "run", "start:prod"]
# ENTRYPOINT ["npm", "start"]