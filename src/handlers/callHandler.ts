import { Request, Response } from "express";
import VoiceResponse = require("twilio/lib/twiml/VoiceResponse");
import fs from "fs-extra";
import axios from "axios";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

const base_url = "https://api.assemblyai.com/v2";
// Assembly AI headers to be added
const headers = { authorization: "ed92dc395436421f83dbb3660f48d237" };

export const answerCall = (req: Request, res: Response) => {
  console.log("hit");
  const resp = new VoiceResponse();
  resp.say(
    "Hello, this is AI the emergency helpline. Please state your name, current location, and describe your emergency situation, Cut the call when you are finished, Your request will be registered once you end the call and we will notify you as your request is registered."
    // "hi",
    // { voice: "alice" }
  );
  resp.record({ maxLength: 120, action: "/handle-recording" });
  resp.say(
    "Thank you for your message. Goodbye."
    //   , { voice: 'alice' }
  );
  res.type("text/xml");
  res.send(resp.toString());
};

export const handleRecording = async (
  req: Request,
  res: Response
): Promise<void> => {
  const recording_url: string = req.body.recording_url;

  const data = { audio_url: recording_url };
  const url: string = `${base_url}/transcript`;

  const response = await axios.post(url, data, { headers });
  const transcriptID = response.data.id;
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptID}`;

  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, {
      headers: headers,
    });
    const transcriptionResult = pollingResponse.data;

    if (transcriptionResult === "completed") {
      // Twilio code to be added
    } else if (transcriptionResult.status === "error") {
      throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};
