#!/bin/bash

MY_PATH="`dirname \"$0\"`"

source ${MY_PATH}/conf.sh

FOTO=$1

curl -v ${API}/data/file/${PI_NAME}/${FOTO} > $FOTO
