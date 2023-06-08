// @ts-nocheck
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import dotenv from "dotenv";
import { Request, Response } from "express";
const fs = require("fs");
const path = require("path");
const AudioRecorder = require("node-audiorecorder");

const options = {
  program: `rec`, // Which program to use, either `arecord`, `rec`, or `sox`.
  device: null, // Recording device to use, e.g. `hw:1,0`

  bits: 16, // Sample size. (only for `rec` and `sox`)
  channels: 1, // Channel count.
  encoding: `signed-integer`, // Encoding type. (only for `rec` and `sox`)
  format: `S16_LE`, // Encoding type. (only for `arecord`)
  rate: 16000, // Sample rate.
  type: `wav`, // Format type.

  // Following options only available when using `rec` or `sox`.
  silence: 2, // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5, // Silence threshold to start recording.
  thresholdStop: 0.5, // Silence threshold to stop recording.
  keepSilence: true, // Keep the silence in the recording.
};

const logger = console;

export const record = async (request: Request, response: Response) => {
  // Create an instance.
  let recorder = new AudioRecorder(options, logger);
  // Constants.
  const DIRECTORY = "examples-recordings";

  // Create path to write recordings to.
  if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
  }

  // Create file path with random name.
  const fileName = path.join(
    DIRECTORY,
    Math.random()
      .toString(36)
      .replace(/[^0-9a-zA-Z]+/g, "")
      .concat(".wav")
  );
  console.log("Writing new recording file at:", fileName);
  // Create write stream.
  const fileStream = fs.createWriteStream(fileName, { encoding: "binary" });
  // Log information on the following events.
  recorder.on("error", function () {
    console.warn("Recording error.");
  });
  recorder.on("end", function () {
    console.warn("Recording ended.");
  });

  // Start and write to the file.

  recorder.start().stream().pipe(fileStream);
  console.log(recorder.stream());
  // Keep process alive.
  process.stdin.resume();
  console.warn("Press ctrl+c to exit.");
};
