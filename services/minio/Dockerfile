FROM quay.io/minio/minio

RUN curl -LO https://dl.min.io/client/mc/release/linux-amd64/mc \
    && chmod +x mc \
    && mv mc /usr/bin

COPY policy.json /policy.json

ENTRYPOINT ["sh", "-c", "mc admin policy create /policy.json && /usr/bin/docker-entrypoint.sh server /data"]

