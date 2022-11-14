cd save destination of log file
echo: new file detected: "%1" "%2">>log.txt 2>&1
curl "https://<rocket.chat server url>/api/v1/rooms.upload/<rocket.chat room id>" -F file=@"%1 %2";type=audio/mpeg  -F "msg=" -F "description=" -H "X-Auth-Token: <rocket.chat token>" -H "X-User-Id: <id of user who will post in room>" >>log.txt 2>&1
