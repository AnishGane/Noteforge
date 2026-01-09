import { Schema, model, models, Types } from "mongoose";

const NotebookSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notebook = models.Notebook || model("Notebook", NotebookSchema);
