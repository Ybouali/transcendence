#!/bin/bash

# npm install

# mkdir -p ${PWD}/data/env/

# mkdir -p ${PWD}/data/avatar_users_images/

# mkdir -p ${PWD}/data/qrcodes_users/



npm install prisma --save-dev

npm install @prisma/client

npx prisma generate

npm run build

npm run start:prod