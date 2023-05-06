FROM node:latest

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY . ./

RUN npm install react-scripts -g

EXPOSE 3000

CMD ["npm","start"]