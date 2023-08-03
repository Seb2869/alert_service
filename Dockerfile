FROM node:18.16.1
WORKDIR /usr/src/alert_service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "main.js" ]