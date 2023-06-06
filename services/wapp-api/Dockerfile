FROM node:16.20-buster
LABEL maintainer="voron@djnn.sh"

RUN apt-get update && apt-get upgrade -y && apt install -y \
    python3 \
    python3-pip

WORKDIR /app

COPY ./wappalyzer .

RUN yarn install

WORKDIR /server

COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY server.py .

ENTRYPOINT [ "uvicorn" ]
CMD ["server:api", "--proxy-headers", "--host", "0.0.0.0", "--port", "4000"]
