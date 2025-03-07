FROM alpine
WORKDIR /app

ADD contracts contracts
ADD file-service/build build
ADD file-service/config/development.yml development.yml

ENV CONFIG_PATH=/app/development.yml

ENTRYPOINT build/file-service