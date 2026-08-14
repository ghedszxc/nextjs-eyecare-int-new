FROM node:21.6.0
WORKDIR /usr/src/app

RUN npm i -g next --verbose

COPY . .

RUN npm install --verbose --force

RUN npm run build

CMD ["/bin/sh", "-c", "cat hosts >> /etc/hosts && cat /etc/hosts && npm run start"]
