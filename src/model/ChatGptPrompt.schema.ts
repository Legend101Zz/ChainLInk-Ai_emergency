import mongoose from "mongoose";

export interface IGPT extends mongoose.Document {
  Time: Date;
  Data: String;
}

export const GPTSchema = new mongoose.Schema({
  Time: { type: String, required: true },
  Data: { type: String, required: true },
});

const GPT = mongoose.model<IGPT>("GPT", GPTSchema);
export default GPT;
