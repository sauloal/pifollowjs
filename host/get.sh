#!/bin/bash

MY_PATH="`dirname \"$0\"`"

source ${MY_PATH}/conf.sh


rm ${REP_FOLDER}/index.html


URL_BASE=/${RNG}/data/
ALL=${URL_PATH}${URL_BASE}/data/all/${PI_NAME}/
BASE=${URL_BASE}/data/file/${PI_NAME}/


wget --verbose --tries=3 --no-clobber --continue --random-wait --no-directories \
--no-host-directories --directory-prefix=site --page-requisites --no-parent \
--base=${BASE} ${ALL}

#--convert-links
#--mirror
