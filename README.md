# Radio-Chat

**Overview**

Radio Chat is a combination of tools and procedures required to merge radio channel communication with Rocket.Chat.
In the public security sector (Police, Firefighters, Medical Emergency etc.), during interventions, many traditional parallel communication channels (radio, phone, video) are used. In addition to these old channels, modern chat services are also being used. This solution integrates radio into Rocket.Chat. This way all radio communication will be recorded in the appropriate Rocket.Chat channel for all concerned to listen when they can (in case they were occupied during the time the transmission took place), mixed with any relevant chat communication. Voice messages are also transcripted into chat for transparency.

**Used applications:**

- Snooper (https://www.snooper.se/)
On a windows computer, we run an application called Snooper, a voice-activated recorder. When the volume of the audio is higher than the set limit, the recorder activates and keeps recording until the volume drops below that limit. After the recording stops, a script is executed that uploads created recording to the selected group. A hard copy of the recorded file stays on the local computer.

- Rocket.chat app - SpeechToText
For transcript of audio files in rocket.chat.
Use microsoft-cognitiveservices-speech-sdk for transcription of audio files in rocket.chat

- VHF bot(rocket.chat bot)
VHF bot(rocket.chat bot) is an application that downloads and plays audio files generated by users in rocket.chat. Bot scans the channel when the audio file is uploaded, bot downloads it and plays it automatically. 

---

**Used hardware:**

- Baofeng UV-5R+ mobile VHF handheld radio
VHF radio is used to receive and transmit audio signals. Radio need to have VOX function to work.

- Windows computer
All applications except rocket.chat run on that computer.

**Scheme:**

![radio chat schem](https://user-images.githubusercontent.com/59833831/201069665-0376bebd-f650-4def-9534-58e80a672ee3.png)

---

**Instructions for application setup:**




- Upload script (upload.bat)

<img width="1011" alt="Screenshot 2022-11-14 at 14 30 31" src="https://user-images.githubusercontent.com/59833831/201672622-919d85f6-d5d2-48de-8137-14144c8073b7.png">

1. Download the script from GitHub repository
2. Open the script with code editor
3. Replace placeholders with your data 

     a. curl "https://<rocket.chat server url>/api/v1/rooms.upload/<rocket.chat room id> - replace <rocket.chat server url> with the URL address of your rocket.chat server and replace <rocket.chat room id> with an ID of room to which you will upload files

     b. "X-Auth-Token: <rocket.chat token>" - replace <rocket.chat token> with a generated token from your rocket.chat server

     c. "X-User-Id: <id of user who will post in room>" - replace <id of user who will post in room> with the user added to the channel who will upload generated files from the Snooper application

4 .Save and exit code editor




- Snooper (We used this app but there may be others with the same functionality.)

1. Download Snooper app from its official website (https://www.snooper.se/download/) and install it
2. Launch application
3. Set up post process with upload script

     a. Go to file and select Options

     ![01_options](https://user-images.githubusercontent.com/59833831/201618504-78cc1f68-9c78-4031-9944-c280a514b35e.jpg)

     b. Select Post processes in menu and click on Plugin manager
       
     ![02_postprocess](https://user-images.githubusercontent.com/59833831/201618586-c44d2790-3864-456c-9ef1-cf4d784c13e1.jpg)

     c. Select and enable Program executer, than click on the wrench icon.
     
     ![03_postprocess](https://user-images.githubusercontent.com/59833831/201618637-4220369e-b5d9-46ff-8436-ec86bb76b429.jpg)

     d. Select upload.bat file that you downloaded from GitHub and edited. Set parameter to %filepath???
     
     ![04_upload](https://user-images.githubusercontent.com/59833831/201618716-be0737c8-b6ed-419f-b556-6a6ffa04d659.jpg)

     e. Click OK and close Options menu

4. Connect VHF radio to computer

5. Select correct input
     a. Go to file and select Options
     
     ![01_options](https://user-images.githubusercontent.com/59833831/201618986-1efc00d8-1684-4ba5-aa16-a3f7121710d7.jpg)

     b. Select General in menu 
     
     ![02_general](https://user-images.githubusercontent.com/59833831/201619036-b13c1490-d231-4436-bbd4-8858cc04d535.jpg)

     c. In Recording device drop-down menu select the correct device
     
     ![03_drop-down](https://user-images.githubusercontent.com/59833831/201619105-452d9272-8ab0-4ff4-ae53-8d7eee8f0863.jpg)

     d. After selecting the correct device click close

6. Set the trigger level. Set level 20-30 decibels above static level.

![01_trigger](https://user-images.githubusercontent.com/59833831/201619206-3c6949d5-a1a0-45c8-ba60-5db58dadbd9b.jpg)

7. Click on record icon to start the recording process.

![02_record](https://user-images.githubusercontent.com/59833831/201619245-0f95f52f-1834-49c0-b18f-76c41bca4f56.jpg)

---
**VHF bot setup**

Prerequisites

1. Azure subscription - Create one for free
2. Create a Speech resource in the Azure portal.
3. Get the resource key and region. After your Speech resource is deployed, select Go to resource to view and manage keys.
4. Create rocket.chat bot user - https://developer.rocket.chat/bots/creating-your-own-bot-from-scratch
5. Install latest version of node.js

Setup process

1. Download VHFbot.js
2. Install package.json
3. Set environment variables:
	- HOST: set your rocket.chat host
	- USER: set bot username (same as in rocket.chat)
	- PASS: set bot password (same as in rocket.chat)
	- BOTNAME: set bot name (same as in rocket.chat)
	- ROOMS: set rid of rooms you want the bot to listen in (separate rid-s with ",")
	- SPEECH_KEY: set azure speech service speech key
	- SPEECH_REGION: set azure speech service region key
	- SPEECH_LANG: set azure speech service language locale. List of supported languages - https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=stt-tts
	- USER_ID: set bot id
4. Run bot

