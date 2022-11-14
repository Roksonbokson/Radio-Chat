cd save destination of log file
echo: new file detected: "%1" "%2">>log.txt 2>&1
curl "https://@123456789@/api/v1/rooms.upload/@123@" -F file=@"%1 %2";type=audio/mpeg  -F "msg=" -F "description=" -H "X-Auth-Token: @123456789@" -H "X-User-Id: @123456789@" >>log.txt 2>&1