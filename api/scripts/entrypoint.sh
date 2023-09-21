#!/usr/bin/env bash

set -eou pipefail

generate_random_string () {
    get_random_char() { echo "${1:RANDOM%${#1}:1}"; }
    {
        UPPERCASE="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        LOWERCASE="abcdefghjiklmnopqrstuvwxyz"
        NUMBERS="0123456789"

        get_random_char "!@\\#\$%^&*?/;:\|+=-_"
        get_random_char $NUMBERS
        get_random_char $LOWERCASE
        get_random_char $UPPERCASE
        for _ in $( seq $(( 32 + RANDOM % 8 )) )
        do
            get_random_char "$NUMBERS$UPPERCASE$LOWERCASE"
        done
    } | sort -R | awk '{printf "%s", $1}'
    echo ""
}

wait_for_it () {

    # check if postgresql-client is installed
    which pg_isready >/dev/null || { echo "Postgres is not installed. Exiting." && exit 1 ; }

    while ! pg_isready -q -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}"; do
        echo "$(date) - waiting for database to start"
        sleep 1
    done
}

# for some reason, old volumes can be persisted and then they explode on startup
find / -name '*.pyc' -delete 2>/dev/null

# generating random secret key (different every time)
DJANGO_SECRET_KEY=$(generate_random_string)
export DJANGO_SECRET_KEY

# force loading of in-container for settings.py
IN_CONTAINER=1
export IN_CONTAINER

# wait for the database to boot up
wait_for_it

echo "$(date) - Running database migrations"
python manage.py makemigrations
python manage.py migrate

python manage.py init_builtin_vuln_types
python manage.py init_bucket
python manage.py init_templates

echo "$(date) - Starting task"
exec gunicorn core.wsgi --config gunicorn.conf.py
