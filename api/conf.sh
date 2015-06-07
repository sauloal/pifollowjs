set -xeu
#CLOUD9
URL_BASE=http://pifollowjs-sauloal.c9.io
APV=2
EPN=api/v${APV}
RNG='54628'
PI_NAME=piname

#RNG_URL=''
#if [[ ! -z "${RNG}" ]]; then
#	RNG_URL="/${RNG}"
#fi
#
#URL=${URL_BASE}${RNG_URL}

URL=${URL_BASE}/${RNG}

API=${URL}/${EPN}

