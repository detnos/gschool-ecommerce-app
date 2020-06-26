FROM node:latest

LABEL maintainer="bmswens@gmail.com" \
      description="A docker container for our E-Commerce app"

ENV POSTGRES_PORT=5432 \
    POSTGRES_HOST=localhost \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=password \
    POSTGRES_DATABASE=postgres \
    PORT=3000

EXPOSE 3000

COPY app /opt/app

WORKDIR /opt/app
RUN npm install

CMD ["npm", "start"]