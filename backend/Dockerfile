FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY . .

COPY .env .env

RUN npm install --production
EXPOSE 8080
CMD ["node", "index.js"]
