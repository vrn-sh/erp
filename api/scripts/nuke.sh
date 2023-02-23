#!/usr/bin/env bash

echo "This script will destroy the database. Are you sure you want to delete this database ?"
read -rp "Press [Enter] key to continue..."

export DATABASE="voron"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DATABASE};"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DATABASE}_test;"
