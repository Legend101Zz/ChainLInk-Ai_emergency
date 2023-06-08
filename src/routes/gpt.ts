import express from "express";
import { sendReq, getReq } from "../handlers/gptHandler";

const GPTRouter = express.Router();

GPTRouter.get("/", sendReq);
GPTRouter.get("/blockchain", sendReq);
export default GPTRouter;
