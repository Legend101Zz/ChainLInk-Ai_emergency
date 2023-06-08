import mongoose from "mongoose";

export interface IRecording extends mongoose.Document {
  Time: Date;
  Data: String;
}

export const RecordingSchema = new mongoose.Schema({
  Time: { type: String, required: true },
  Data: { type: String, required: true },
});

const Recording = mongoose.model<IRecording>("Recording", RecordingSchema);
export default Recording;
