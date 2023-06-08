// @ts-nocheck
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const mic = require("mic");
const { Readable } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
import { Request, Response } from "express";

import Recording from "../model/recording.schema";

dotenv.config();

const API_KEY = process.env.API_KEY;
const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);
ffmpeg.setFfmpegPath(ffmpegPath);

// Record audio
function recordAudio(filename) {
  return new Promise((resolve, reject) => {
    const micInstance = mic({
      rate: "16000",
      channels: "1",
      fileType: "wav",
    });

    const micInputStream = micInstance.getAudioStream();
    const output = fs.createWriteStream(filename);
    const writable = new Readable().wrap(micInputStream);

    console.log("Recording... Press Ctrl+C to stop.");

    writable.pipe(output);

    micInstance.start();
    setTimeout(function () {
      micInstance.stop();
      console.log("Finished recording");
      resolve();
    }, 20000);

    micInputStream.on("error", (err) => {
      reject(err);
    });
  });
}

// Transcribe audio
async function transcribeAudio(filename) {
  const transcript = await openai.createTranscription(
    fs.createReadStream(filename),
    "whisper-1"
  );
  return transcript.data.text;
}

export const main = async (req: Request, res: Response) => {
  const audioFilename = "recorded_audio.wav";
  await recordAudio(audioFilename);
  const transcription = await transcribeAudio(audioFilename);

  const date = new Date();
  const recording = new Recording({ Time: date, Data: transcription });
  console.log("Transcription:", transcription, recording);
  recording
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).send({ message: "Success", data: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ message: "err in video" });
    });
};
