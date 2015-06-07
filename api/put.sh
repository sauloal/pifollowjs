#!/bin/bash

MY_PATH="`dirname \"$0\"`"

source ${MY_PATH}/conf.sh

FOTO=$1

curl -X PUT --form "foto=@${FOTO}" --form "pi_name=${PI_NAME}" ${API}/data
