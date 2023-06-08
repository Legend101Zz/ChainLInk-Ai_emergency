import { Configuration, OpenAIApi } from "openai";
import { Request, Response } from "express";
import dotenv from "dotenv";
import GPT from "../model/ChatGptPrompt.schema";
import Recording from "../model/recording.schema";

dotenv.config();

const API_KEY: string = process.env.API_KEY || "";

const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

export const sendReq = async (req: Request, res: Response) => {
  console.log("here");
  await Recording.find()
    .then(async (result: any) => {
      const transcribed_text = result[result.length - 1].Data;
      const transcribed_time = result[result.length - 1].Time;
      console.log(transcribed_text);

      console.log("Sending request to GPT-3");

      const model_engine = "text-davinci-003";
      const temperature = 0.5;
      const max_tokens = 300;

      const prompt = `What is the emergency type, location, and priority of the following message. Your response must be in the following JSON format: {name, location, emergency_type, priority, reply_msg}. Available emergency_types=['Ambulance', 'NSG', 'Police', 'Rescue team', 'Fire brigade', 'Forest ranger']. Available priority=['high', 'medium', 'low']. Prompt: ${transcribed_text} and time ${transcribed_time}`;

      await openai
        .createCompletion({
          model: model_engine,
          prompt,
          temperature,
          max_tokens,
        })
        .then((response) => {
          //   const completionText = response.choices[0].text;
          const completionText = response.data.choices[0].text;
          const gptText = new GPT({
            Data: completionText,
            Time: transcribed_time,
          });
          gptText
            .save()
            .then((result) => {
              console.log(result);
              res
                .status(200)
                .send({ message: "Success", text: completionText });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getReq = async (req: Request, res: Response) => {
  await GPT.find()
    .then((result) => {
      console.log(result);
      const response = result[result.length - 1].Data;
      res.status(200).send({ text: response });
    })
    .catch((err) => {
      console.log(err);
    });
};
