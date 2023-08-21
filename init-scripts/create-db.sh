#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tasks') THEN
            CREATE DATABASE tasks;
        END IF;
    END
    \$\$;
EOSQL
