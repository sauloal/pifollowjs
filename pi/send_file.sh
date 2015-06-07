MY_PATH="`dirname \"$0\"`"

source ${MY_PATH}/conf.sh

FN=$1

#ENDPOINT=$1
#RND=$2
#PINAME=$3
#FN=$4

#if [[ -z "$ENDPOINT" ]]; then
#        echo NO ENDPOINT PASSED
#        exit 1
#fi

#if [[ -z "$RND" ]]; then
#        echo NO RANDON NUMBER PASSED
#        exit 1
#fi

#if [[ -z "$PINAME" ]]; then
#        echo NO PINAME PASSED
#        exit 1
#fi

#if [[ -z "$FN" ]]; then
#        echo NO FILE NAME GIVEN
#        exit 1
#fi


FN=`readlink -f ${FN}`

curl -X PUT --form foto=@"${FN}" --form pi_name=${PI_NAME} ${URL}/data
