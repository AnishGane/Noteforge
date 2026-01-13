"use server";

import { connectDB } from "@/lib/mongodb";
import { NoteDB, NotebookDB, NotebookResponse } from "@/types";
import { ObjectId } from "mongodb";
import { getAuthSession } from "./get-auth-session";

export const createNoteBook = async (name: string) => {
  try {
    const session = await getAuthSession();

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to create a notebook",
      };
    }

    const db = await connectDB();

    await db.collection("notebooks").insertOne({
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Notebook created successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error creating notebook",
    };
  }
};

export const getNoteBooks = async () => {
  try {
    const session = await getAuthSession();

    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Please login to view notebooks",
        data: { notebooks: [], notes: [] },
      };
    }

    const db = await connectDB();

    // Fetch notebooks
    const notebooks = await db
      .collection<NotebookDB>("notebooks")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch notes for those notebooks
    const notebookIds = notebooks.map((n) => n._id);

    const notes = await db
      .collection<NoteDB>("notes")
      .find({ notebookId: { $in: notebookIds } })
      .toArray();

    // Build a count map: notebookId -> count
    const notesCountMap = notes.reduce<Record<string, number>>((acc, note) => {
      const key = note.notebookId.toString();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Attach notesCount to each notebook
    const notebooksWithCount = notebooks.map((notebook) => ({
      ...notebook,
      notesCount: notesCountMap[notebook._id.toString()] ?? 0,
    }));

    return {
      success: true,
      message: "Notebooks fetched successfully",
      data: {
        notebooks: notebooksWithCount,
        notes,
      },
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error fetching notebooks",
      data: { notebooks: [], notes: [] },
    };
  }
};

export const getNoteBookById = async (
  id: string
): Promise<NotebookResponse> => {
  try {
    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid notebook ID format",
        data: null,
      };
    }

    const session = await getAuthSession();

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to view notebook",
        data: null,
      };
    }

    const db = await connectDB();

    const notebook = await db.collection("notebooks").findOne({
      _id: new ObjectId(id),
      userId,
    });

    if (!notebook) {
      return {
        success: false,
        message: "Notebook not found or you don't have permission",
        data: null,
      };
    }

    const notes = await db
      .collection("notes")
      .find({ notebookId: new ObjectId(id) })
      .sort({ updatedAt: -1 })
      .toArray();

    return {
      success: true,
      message: "Notebook fetched successfully",
      data: {
        _id: notebook._id.toString(),
        name: notebook.name,
        userId: notebook.userId,
        createdAt: notebook.createdAt,
        updatedAt: notebook.updatedAt,
        notes: notes.map((note) => ({
          _id: note._id.toString(),
          notebookId: note.notebookId.toString(),
          title: note.title,
          content: note.content,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
        })),
      },
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error fetching notebook",
      data: null,
    };
  }
};

export const updateNoteBook = async (id: string, name: string) => {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid notebook ID format",
        data: null,
      };
    }
    const db = await connectDB();
    await db
      .collection("notebooks")
      .updateOne({ _id: new ObjectId(id) }, { $set: { name } });
    return {
      success: true,
      message: "Notebook updated successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error updating notebook",
    };
  }
};

export const deleteNoteBook = async (id: string) => {
  try {
    const db = await connectDB();
    await db.collection("notebooks").deleteOne({ _id: new ObjectId(id) });
    return {
      success: true,
      message: "Notebook deleted successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error deleting notebook",
    };
  }
};
