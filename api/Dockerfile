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
    python-dev

WORKDIR /api

EXPOSE 8000

COPY requirements.txt ./
RUN pip install -r requirements.txt --use-pep517
COPY . .

ENTRYPOINT [ "/api/scripts/entrypoint.sh" ]
