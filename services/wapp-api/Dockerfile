FROM node:16.20-buster

RUN apt-get update && apt-get upgrade -y && apt install -y \
    python3 \
    python3-pip \
    udev \
    chromium \
    libx11-dev \
    libxss1

WORKDIR /app
COPY . .
RUN cd wappalyzer && yarn install && yarn run link && cd ..

COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt

COPY server.py .
ENTRYPOINT [ "uvicorn" ]
CMD ["server:api", "--proxy-headers", "--host", "0.0.0.0", "--port", "4000"]
