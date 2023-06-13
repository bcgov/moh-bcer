FROM node:14.17.6-slim

ENV PATH $PATH:/usr/src/app/node_modules/.bin

WORKDIR '/app'

# Install dependencies
COPY ./package.json ./
RUN npm install

# Copy source files
COPY . .

# Build application
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
