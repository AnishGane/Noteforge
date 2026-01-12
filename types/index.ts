import { ObjectId } from "mongodb";
import { JSONContent } from "@tiptap/react";

export type NotebookDB = {
  _id: ObjectId;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteDB = {
  _id?: ObjectId;
  notebookId: ObjectId;
  title: string;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export interface NotebookNote {
  _id: string;
  notebookId: string;
  title: string;
  content: JSONContent;
  createdAt: Date;
}

export interface NotebookData {
  _id: string;
  name: string;
  notes: NotebookNote[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface NotebookResponse {
  success: boolean;
  message: string;
  data?: NotebookData | null;
}
