FROM node:14.17.0-alpine3.11
USER root
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/app.js"]
