#!/bin/bash

MY_PATH="`dirname \"$0\"`"

source ${MY_PATH}/conf.sh

curl ${URL}/data/all
