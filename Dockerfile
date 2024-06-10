FROM node:16 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine AS production-stage

RUN npm install -g http-server

WORKDIR /app

COPY --from=build-stage /app/dist /app

EXPOSE 5173

CMD ["http-server", "-p", "5173"]
