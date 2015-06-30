set -xeu
#CLOUD9
URL_BASE=http://pifollow.aflitos.net
#URL_BASE=http://127.0.0.1
#URL_BASE=http://localhost
URL_PORT=80
APV=2
EPN=api/v${APV}
RNG='dc97d7355965f2d9f81130ba555510e0'
PI_NAME=aflitos

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

