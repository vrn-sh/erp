#!/usr/bin/env bash

set -eou pipefail


install_postgresql () {
    # Assumes you're on Ubuntu for simplicity
    sudo apt-get install -y postgresql postgresql-contrib libpq-dev || true

    sudo systemctl start postgresql.service || true
    sudo /etc/init.d/postgresql start || true
    echo "setting up postgresql databases"

    export POSTGRES_USER="${USER}"
    export POSTGRES_PASSWORD="postgres"
    export POSTGRES_DB="voron"

    # Create the database
    echo "Creating database $POSTGRES_DB"
    sudo -u postgres psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" || true
    sudo -u postgres psql -c "GRANT postgres TO $POSTGRES_USER;" || true
    sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

    # https://stackoverflow.com/a/14186439
    sudo -u postgres psql -c "ALTER USER $USER CREATEDB;"
}


############
## SCRIPT ##
############

# necessary known dependencies
sudo apt-get install build-essential python3-dev python-dev || true

install_postgresql

