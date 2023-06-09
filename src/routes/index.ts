import express from "express";
import CallRouter from "./call";
import GPTRouter from "./gpt";
import AdminRouter from "./admin";

const router = express.Router();
router.use("/gpt", GPTRouter);
router.use("/call", CallRouter);
router.use("/admin", AdminRouter);
export default router;
