# syntax=docker/dockerfile:1

FROM python:3.11

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get install -y --no-install-recommends \
    apt-utils \
    postgresql-client \
    build-essential \
    libffi-dev \
    python3-dev \
    software-properties-common && \
    apt-get clean all && \
	rm -rf -rvf /var/lib/apt/lists/*

WORKDIR /api

EXPOSE 8000

COPY requirements.txt ./
RUN pip install -r requirements.txt --use-pep517
COPY . .

ENTRYPOINT [ "/api/scripts/entrypoint.sh" ]
