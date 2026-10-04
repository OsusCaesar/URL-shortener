FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL

RUN npm run build

FROM nginx:1.30

COPY --from=builder /app/dist /usr/share/nginx/html