FROM alpine
WORKDIR /app

ADD contracts contracts
ADD sso/build build
ADD sso/config/development.yml development.yml
ADD .keys .keys

ENV CONFIG_PATH=/app/development.yml

ENTRYPOINT build/api-gateway
