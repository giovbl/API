
FROM node:24-alpine

WORKDIR /usr/src/app

# Adding required packages
RUN apk add --no-cache git typescript

# SPA setup
RUN git clone https://github.com/giovbl/FrontEnd.git
WORKDIR /usr/src/app/FrontEnd
RUN npm install
RUN npm install vite
RUN npm run build
RUN cp -R dist ../dist
WORKDIR /usr/src/app
RUN rm -rf ./FrontEnd

#API setup
COPY package*.json ./
RUN npm install
COPY . .

# Final configuration
EXPOSE 3000
CMD ["npm", "test"]
