# syntax=docker/dockerfile:1
FROM python:latest

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get install -y --no-install-recommends \
    apt-utils \
    postgresql-client \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    software-properties-common

RUN apt-get update && apt-get install -y \
    pdftk

RUN wget -O wkhtmltox https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb

RUN dpkg -i wkhtmltox; apt-get install -y -f

RUN apt-get clean all \
	&& rm -rf -rvf /var/lib/Apt/lists/*

WORKDIR /api

EXPOSE 8000

COPY requirements.txt ./
RUN pip install -r requirements.txt --use-pep517
COPY . .

ENTRYPOINT [ "/api/scripts/entrypoint.sh" ]
