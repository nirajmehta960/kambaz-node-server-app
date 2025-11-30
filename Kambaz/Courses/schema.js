import mongoose from "mongoose";
import modulesSchema from "../Modules/schema.js";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    modules: [modulesSchema],
  },
  { collection: "courses" }
);

export default courseSchema;
