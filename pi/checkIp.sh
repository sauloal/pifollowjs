IP=`hostname -I | tr -d ' '`

if [[ -z "$IP" ]]; then
    echo "NO IP. RESTARTING"
    sudo ifdown wlan0
    sudo ifup   wlan0
else
    echo "ALL FINE. CARRY ON"
fi
