#!/bin/env bash

set -euo pipefail

##
## Simple script initiating default root bucket
## using access logins provided by .env file
##

MC=/usr/bin/mc

ROOT_BUCKET=rootbucket
ENDPOINT=http://s3:9000
ROOT_DIR=buckets


"${MC}" config host add "${ROOT_BUCKET}" "${ENDPOINT}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}";

"${MC}" mb --quiet "${ROOT_DIR}"/"${ROOT_BUCKET}";

"${MC}" policy set none "${ROOT_DIR}"/"${ROOT_BUCKET}"
