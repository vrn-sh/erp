# syntax=docker/dockerfile:1
FROM python:latest

RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get install -y --no-install-recommends \
    apt-utils \
    postgresql-client

WORKDIR /api

EXPOSE 8080

COPY requirements.txt ./
RUN pip install -r requirements.txt --use-pep517
COPY . .

ENTRYPOINT [ "/api/scripts/entrypoint.sh" ]
CMD [ "/api/manage.py", "runserver", "0.0.0.0:8080" ]
