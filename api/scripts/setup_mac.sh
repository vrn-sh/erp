#!/usr/bin/env bash

set -eou pipefail

install_postgresql () {
    # Assumes you're on macOS with Homebrew
    brew install postgresql || true

    brew services start postgresql || true
    brew install --cask wkhtmltopdf
    echo "setting up postgresql databases"

    export POSTGRES_USER="${USER}"
    export POSTGRES_PASSWORD="postgres"
    export POSTGRES_DB="voron"

    # Create the database
    echo "Creating database $POSTGRES_DB"
    psql -U postgres -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" || true
    psql -U postgres -c "GRANT postgres TO $POSTGRES_USER;" || true
    psql -U postgres -c "CREATE DATABASE $POSTGRES_DB;"
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

    # https://stackoverflow.com/a/14186439
    psql -U postgres -c "ALTER USER $USER CREATEDB;"
}

############
## SCRIPT ##
############

install_postgresql
