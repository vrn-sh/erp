# voron API

---

## 💻 project description

This API manages all operations performed by the CRUD platform.

### 🏭 Tech stack

- [DRF](https://www.django-rest-framework.org/) is the main framework used to build the API
- [Postgres](https://www.postgresql.org/) is the database used for this project
- [Docker](https://www.docker.com/) is used to serve and deploy the application through containers (we use `docker-compose` to orchestrate them seemlessly)
- [Gunicorn](https://gunicorn.org/) is our WSGI of choice, to serve HTTP requests across multiple workers.

---

## 📐 project setup

### ✨ As project contributor

If you want to run locally the application, you should first run the `setup` scripts,
and then run it as you would normally for a Python.

Up-to-date information on how to install the app can be found [here](../toolbox/docs/CONTRIBUTE.md)

<details>

> Note: it is recommanded to use [ASDF](https://asdf-vm.com/guide/getting-started.html) to ensure maximum compatibility.
> In our case, we use it to specify the Python version, which is currently `3.10.8`

Install setup:

```bash

# go to the project root directory
cd voron

# setup your own .env file
cp .env-dist .env
vim .env # put your actual .env values here

# add the DOMAIN_NAME value from your .env file in /etc/hosts
# we will use voron.lan in that example
#
# RUN THIS AS ROOT
echo "127.0.0.1   voron.lan" >> /etc/hosts

# run the database setup script:
# - will assume you're running Ubuntu for the postgresql installation etc
# - will automatically install packages, such as Postgresql 15.
#
# [!] if you have another install running on port 5432, it could create conflicts!
./../toolbox/scripts/setup.sh

# create a virtual env
python -m venv ~/.local/venv_core

# enable the virtual env
. ~/.local/venv_core/bin/activate

# install pip dependencies
pip install -r requirements.txt

# migrations should already be done, so you can just run the server
python manage.py runserver 8000

# if you need to create new migrations (make sure postgresql is running and you have your env values set up)
python manage.py makemigrations # OPTIONAL
python manage.py migrate

# or, if you wish to interact with the models directly:
python manage.py shell
```

</details>

### ✨ As a project user

If you're just planning on _using_ the API, but not develop on it, you can easily run it with Docker.

1. Install [Docker](https://docs.docker.com/engine/install/ubuntu/) if not already done

2. [Optional] Do the [post-install steps](https://docs.docker.com/engine/install/linux-postinstall/)

3. Run the following, once you have tested that your install works:

<details>

```bash

# build the image
docker build . -t core

# Optionally, create your own .env file
cp .env-dist .env
vim .env

# add the DOMAIN_NAME value from your .env file in /etc/hosts
# we will use voron.lan in that example
#
#
sudo echo "127.0.0.1   voron.lan" >> /etc/hosts

# run on port 8000 (assuming postgresql daemon is running and migrations have been done)
docker run -p "8000" --env-file .env core

```

</details>

---

### 🧪 Testing

To run tests, just do
```bash
# enable virtualenv
. ~/.local/venv_core/bin/activate

# assuming postgresql service is already running in the background
python manage.py test

# or, if you want to test a single test case
python manage.py test api.tests.AuthTestCase

# or, just one method
python manage.py test api.tests.AuthTestCase.test_can_login_pentester_account
```

---

## 🔍 Usage

### Access docs

To access the `/docs` endpoint of the API in your browser, you must run the API like so:
```bash
python manage.py runserver --insecure
```

You may then find an [OpenAPI](https://www.openapis.org/) specification at the `http://localhost:8000/docs` endpoint.
This can then be imported in the REST client of your choice, we recommend:
- [Postman](https://www.postman.com/) -- industry leader, full of features, and great for development within a team.
- [Insomnia](https://insomnia.rest/) -- works offline, comfy UI, super easy to work with.
- [HTTPie](https://httpie.io/docs/cli) -- works in the Terminal, but currently cannot import OpenAPI specs.

---
