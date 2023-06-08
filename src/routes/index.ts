import express from "express";
import CallRouter from "./call";
import GPTRouter from "./gpt";

const router = express.Router();
router.use("/gpt", GPTRouter);
router.use("/call", CallRouter);

export default router;
