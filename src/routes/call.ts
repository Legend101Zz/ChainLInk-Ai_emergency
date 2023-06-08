import express from "express";

import { main } from "../handlers/testGPT";
const CallRouter = express.Router();

CallRouter.get("/", main);
export default CallRouter;
