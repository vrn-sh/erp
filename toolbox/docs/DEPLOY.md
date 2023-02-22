# voron deployment guide

## Using Docker

### Using Caddy as a reverse-proxy
We recommend putting your `voron` setup behind a reverse-proxy.
Here is how you can do such a thing using [Caddy](https://caddyserver.com/):

```caddy
test.example.com {
        log {
                output file /var/log/caddy/test.example.com-access.log
        }
        @disallowedMethods {
                method CONNECT
        }
        respond @disallowedMethods "HTTP Method Not Allowed" 405
        root * /srv/example.com/public
        file_server
        @notStatic {
                not path /static/*
        }
        encode zstd gzip
        reverse_proxy @notStatic :8080
}
```

### Using nginx as a reverse-proxy
Here is how you can put your `voron` setup behind a reverse-proxy using `nginx`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name test.example.com;
    return 302 https://$server_name$request_uri;
}

server {

    # SSL configuration (used as an example, but you can also use certbot, for instance)

    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate         /etc/ssl/cert.pem;
    ssl_certificate_key     /etc/ssl/key.pem;
    ssl_verify_client on;

    server_name test.example.com;
    location / {
            proxy_pass http://127.0.0.1:8080/;
    }
}
```

---

> These setups are very basic, and it is recommended for you to do your own research regarding how
> to deploy your reverse-proxy. This is just here to get you started

Once you have your reverse-proxy setup, you can just start by cloning the `voron` repository in the directory
of your choice, like so:

```bash
git clone git@github.com:vrn-sh/erp.git
```

go to the `erp/api` directory, using the `cd` built-in:

```bash
cd erp/api
```

Copy the neatly provided `.env-dist` to `.env`:

```bash
cp .env-dist .env
```

You will now have to change some values inside, it is recommended to change the following ones:

```bash
POSTGRES_PASSWORD=something                         # put a very secure password here!

DOMAIN_NAME=test.example.com                        # put the url of your voron instance

SENDGRID_API_KEY=SG_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # put your very own sendgrid API key
SENDGRID_SENDER=something@email.com                 # put a sendgrid-verified email
```

If you want to generate a secure password, you can use the following command:
```bash
# will use characters included in the owasp special characters list:
# https://owasp.org/www-community/password-special-characters
tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 64 ; echo
```

If you want to learn more about Sendgrid, click [here](https://sendgrid.com/).

Once all of this is done, ensure you have the latest version of `docker` installed, using:
```bash
sudo docker run hello-world
```

If the command succeeded, you can go to the root of the repository and pull up the instance:
```bash
# go back one directory
cd ..

# run the instance (containers will run in the background)
sudo docker compose up -d
```

If you want to ensure the logs are correct, you can use the following command:

```bash
sudo docker compose logs -ft # use ctrl-c to exit
```

---

and that's it! we hope you will enjoy your voron instance. :)~
