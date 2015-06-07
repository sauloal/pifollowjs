MY_PATH="`dirname \"$0\"`"

source ${MY_PATH}/conf.sh

IP=`hostname -I  | tr -d ' '`

curl -X PUT --form pi_name=${PI_NAME} --form ip=${IP} ${URL}/ips
