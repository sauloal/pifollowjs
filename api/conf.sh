set -xeu
#CLOUD9
URL_BASE=http://127.0.0.1
URL_PORT=11223
APV=2
EPN=api/v${APV}
RNG='dc97d7355965f2d9f81130ba555510e0'
PI_NAME=pi2

if [[ -f "secret.sh" ]]; then
	echo "sourcing secret"
	source secret.sh
	echo "RNG    $RNG"
	echo "SECRET $SECRET"
	RNG=$SECRET
fi

#RNG_URL=''
#if [[ ! -z "${RNG}" ]]; then
#	RNG_URL="/${RNG}"
#fi
#
#URL=${URL_BASE}${RNG_URL}

URL=${URL_BASE}:${URL_PORT}/${RNG}

API=${URL}/${EPN}

