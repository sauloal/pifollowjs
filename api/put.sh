#!/bin/bash
source conf.sh
FOTO=$1

curl -X PUT --form "foto=@${FOTO}" --form "pi_name=${PI_NAME}" ${API}/data
