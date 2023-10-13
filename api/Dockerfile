# syntax=docker/dockerfile:1

FROM python:3.11

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get install -y --no-install-recommends \
    apt-utils \
    postgresql-client \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    pdftk \
    xfonts-base \
    xfonts-75dpi \
    software-properties-common

RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb -O libssl.deb && \
    dpkg -i libssl.deb

RUN wget -O wkhtmltox.deb https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.bullseye_amd64.deb && \
    dpkg -i wkhtmltox.deb && \
    apt-get install -y -f && \
    apt-get clean all && \
	rm -rf -rvf /var/lib/apt/lists/*

WORKDIR /api

EXPOSE 8000

COPY requirements.txt ./
RUN pip install -r requirements.txt --use-pep517
COPY . .

ENTRYPOINT [ "/api/scripts/entrypoint.sh" ]
