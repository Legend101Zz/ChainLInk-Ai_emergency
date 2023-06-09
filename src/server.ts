import express, { Request, Response } from "express";
import router from "./routes";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = 5000;
const MONGODB_URI: string = process.env.MONGODB_URI || "";

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", router);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Database Connected!!");
    const server = app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
