FROM node:14-alpine as build-stage
WORKDIR /app

# Install deps
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci

# Build app
COPY . .
RUN npm run build

# production stage
FROM nginx:1.21.3-alpine as production-stage

COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
