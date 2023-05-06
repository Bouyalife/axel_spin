FROM node:latest

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY . ./

EXPOSE 3000

CMD ["npm","start"]