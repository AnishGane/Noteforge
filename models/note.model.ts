import { Schema, model, models, Types } from "mongoose";

const NoteSchema = new Schema(
  {
    notebookId: {
      type: Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "Untitled",
    },

    content: {
      type: Schema.Types.Mixed, // for Tiptap JSON
      default: {
        type: "doc",
        content: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Note = models.Note || model("Note", NoteSchema);
