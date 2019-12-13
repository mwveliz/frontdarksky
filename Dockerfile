FROM node:8 as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build
