#!/bin/bash
source conf.sh
FOTO=$1

curl -X DELETE --form "foto=${FOTO}" --form "pi_name=${PI_NAME}" ${API}/data
