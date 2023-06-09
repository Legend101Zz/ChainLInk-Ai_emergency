import { Request, Response } from "express";
import Recording from "../model/recording.schema";
import GPT from "../model/ChatGptPrompt.schema";

export const main = async (req: Request, res: Response) => {
  const gptData = await GPT.find();
  await Recording.find()
    .then((result) => {
      console.log(result);
      const GPT = gptData[result.length - 1].Data;
      const response = result;
      res.render("main", { text: response, GPT: GPT });
    })
    .catch((err) => {
      console.log(err);
    });
};
