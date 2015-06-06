#!/bin/bash
source conf.sh
FOTO=$1

curl -v ${API}/data/file/${PI_NAME}/${FOTO} > $FOTO
