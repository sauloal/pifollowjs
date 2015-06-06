set -xeu
PRJ=pifollowjs
APV=1
EPN=api/v${APV}
RNG='54628'
RNG_URL=''
PI_NAME=piname
if [[ ! -z "${RNG}" ]]; then
	RNG_URL="/${RNG}"
fi
URL=http://${PRJ}-sauloal.c9.io${RNG_URL}
API=${URL}/${EPN}

