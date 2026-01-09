import { ObjectId } from "mongodb";

export type NotebookDB = {
  _id: ObjectId;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteDB = {
    _id: ObjectId;
    notebookId: ObjectId;
    title: string;
    content: unknown;
    createdAt: Date;
    updatedAt: Date;
  };
  
