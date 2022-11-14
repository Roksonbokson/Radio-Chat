// Requirements
const { driver } = require('@rocket.chat/sdk');
const FFplay = require("ffplay");
const converter = require("video-converter");
const fs = require("fs");
const https = require('https');
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Environment Setup
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASS = process.env.PASS;
const BOTNAME = process.env.BOTNAME;
const ROOMS = process.env.ROOMS.split(",");
const SPEECH_KEY = process.env.SPEECH_KEY;
const SPEECH_REGION = process.env.SPEECH_REGION;
const SPEECH_LANG = process.env.SPEECH_LANG || "en-GB";
const TRANSCRIBE = SPEECH_KEY && SPEECH_REGION;
const USER_ID = process.env.USER_ID;
const SSL = true;
var myUserId;

// Bot configuration
const runbot = async () => {
    const conn = await driver.connect({ host: HOST, useSsl: SSL })
    myUserId = await driver.login({ username: USER, password: PASS });
    const roomsJoined = await driver.joinRooms( ROOMS );
    console.log('joined rooms');

    const subscribed = await driver.subscribeToMessages();
    console.log('subscribed');

    const msgloop = await driver.reactToMessages( processMessages );
    console.log('connected and waiting for messages');

    for (var i=0; i<ROOMS.length; i++){
      const sent = await driver.sendToRoom( BOTNAME + ' is listening ...', ROOMS[i]);
      console.log('Greeting message sent');
    }
}

// Process messages
const processMessages = async(err, message, messageOptions) => {
  if (!err) {
    if (message.u._id === myUserId) return;
    const roomname = await driver.getRoomName(message.rid);
    const linkAudio = message.attachments && message.attachments[0] && message.attachments[0].audio_url;

    if (message.u._id === USER_ID) {
      console.log("SRC user sent msg  - ignore", message.u)
    }
    else { // PLAY audio
      console.log("SRC user sent msg  - process")
      if (linkAudio) {
        console.log("SRC user sent msg  - play", message.attachments[0].audio_url)
        var player = new FFplay("https://" + HOST + message.attachments[0].audio_url);
        player = null;
      }
    }
    if (TRANSCRIBE && linkAudio) { // transcribe all audio messages
      https.get("https://" + HOST + linkAudio,(res) => {
        // Image will be stored at this path
        const path = `${__dirname}/temp.mp3`; 
        const filePath = fs.createWriteStream(path);

        res.pipe(filePath);
        filePath.on('finish',() => {
          filePath.close();
          converter.convert(path, `${__dirname}/temp.wav`, function() {  // TODO - rename file to rand string and delete after upload
            fromFile("temp.wav", message.rid);
          })
        })
      })
    }
  }
}

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
speechConfig.speechRecognitionLanguage = SPEECH_LANG;

function fromFile(filename, room) {
    let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filename));
    let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    speechRecognizer.recognizeOnceAsync(result => {
        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                driver.sendToRoom( `RECOGNIZED: ${result.text}` , room);
                break;
            case sdk.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
            case sdk.ResultReason.Canceled:
                const cancellation = sdk.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);

                if (cancellation.reason == sdk.CancellationReason.Error) {
                    console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                    console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    console.log("CANCELED: Did you set the speech resource key and region values?");
                }
                break;
        }
        speechRecognizer.close();
    });
}


runbot()
