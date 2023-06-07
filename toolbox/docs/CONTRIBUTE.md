# install locally

To manage languages through the application, we use [asdf](https://asdf-vm.com/guide/getting-started.html).
It is recommanded to use this tool to ensure you have the correct version when running the app.

You can also look at [.tool-versions](../../.tool-versions) to know which version should be used for every
service.

## [voron-api](../../api/README.md)

> Located in `./api`

You will need to install the following depencies, please look at how to install them
depending on your OS.

- [Postgresql 15](https://www.postgresql.org/download/)
- [Python 3.10](https://www.python.org/downloads/release/python-3100/)

> If you're using `asdf` to manage your programs, you can go to the root repository folder
> and type `asdf install` to install the correct language version automatically

> You can now use docker-compose to run the application locally!
>
> To do so, just run `docker compose -f docker-compose-dev.yml up` !

### First install
On your first install, you can run (assuming you have `bash` installed):
```bash
cd api

# create a new .env file
cp .env-dist .env

# edit the .env with your own variables
vim .env

# create a new virtualenv
python -m venv ~/.local/venv_core

# activate the virtual env
. ~/.local/venv_core/bin/activate

# install the dependencies
pip install -r requirements.txt

# should set-up your database
#
# this script assumes you are running a debian-based distro,
# if its not the case, you are welcome to add an option to support your own distro
# and submit it as a PR
./scripts/setup.sh
```

### Run the application
You can then run the application (assuming it is installed)

```bash
# load .env variables
set -a
source .env

# load virtual env
. ~/.local/venv_core/bin/activate

# if you just updated the application, you can fetch new dependencies
# and running migrations
pip install -r requirements.txt
python manage.py migrate

# run the back-end on port 8000
python manage.py runserver 8000
```

### Running [min.io](https://min.io)

You can either set the address of an S3 bucket, or use `minio` as we do.
To do so, please have a look at the (very well made) docs for MinIO & follow the
relevant guide.

### Footnotes

- For development, we use [pylint](https://pypi.org/project/pylint/) and [prospector](https://prospector.landscape.io/en/master/index.html).
If you plan on submitting a PR, please ensure your code is consistent with that style.
- If you want to run unit tests, please also export `TEST=1` in your shell before running them.


## [voron-web](../../web/README.md) (aka `moron` :%))

### Install locally

Assuming you use `bash`, you should type the following commands:
```bash
# make will use yarn under the hood to fetch dependencies
make dependencies

# if you want to know the available `make` commands
make help
```

> Please note we use `yarn` for our development and do not plan on supporting `npm`

### Running the app

```bash
# to build a minified version in dist/ folder
make build

# to run in watch mode
make watch

# to run in dev mode
make run
```
