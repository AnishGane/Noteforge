"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

// Create a new note
export const createNote = async (notebookId: string, title?: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to create a note",
      };
    }

    // Validate notebookId format
    if (!ObjectId.isValid(notebookId)) {
      return {
        success: false,
        message: "Invalid notebook ID format",
      };
    }

    const db = await connectDB();

    // Verify the notebook exists and belongs to the user
    const notebook = await db.collection("notebooks").findOne({
      _id: new ObjectId(notebookId),
      userId,
    });

    if (!notebook) {
      return {
        success: false,
        message: "Notebook not found or you don't have permission",
      };
    }

    const newNote = await db.collection("notes").insertOne({
      notebookId: new ObjectId(notebookId),
      title: title || "Untitled",
      content: {
        type: "doc",
        content: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Note created successfully",
      data: { _id: newNote.insertedId },
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error creating note",
    };
  }
};

// Get all notes for a specific notebook
export const getNotesByNotebookId = async (notebookId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to view notes",
        data: [],
      };
    }

    // Validate notebookId format
    if (!ObjectId.isValid(notebookId)) {
      return {
        success: false,
        message: "Invalid notebook ID format",
        data: [],
      };
    }

    const db = await connectDB();

    // Verify the notebook belongs to the user
    const notebook = await db.collection("notebooks").findOne({
      _id: new ObjectId(notebookId),
      userId,
    });

    if (!notebook) {
      return {
        success: false,
        message: "Notebook not found or you don't have permission",
        data: [],
      };
    }

    const notes = await db
      .collection("notes")
      .find({ notebookId: new ObjectId(notebookId) })
      .sort({ updatedAt: -1 })
      .toArray();

    return {
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error fetching notes",
      data: [],
    };
  }
};

// Get a single note by ID
export const getNoteById = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to view note",
        data: null,
      };
    }

    // Validate note ID format
    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid note ID format",
        data: null,
      };
    }

    const db = await connectDB();
    const note = await db.collection("notes").findOne({
      _id: new ObjectId(id),
    });

    if (!note) {
      return {
        success: false,
        message: "Note not found",
        data: null,
      };
    }

    // Verify the note's notebook belongs to the user
    const notebook = await db.collection("notebooks").findOne({
      _id: note.notebookId,
      userId,
    });

    if (!notebook) {
      return {
        success: false,
        message: "You don't have permission to view this note",
        data: null,
      };
    }

    return {
      success: true,
      message: "Note fetched successfully",
      data: note,
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error fetching note",
      data: null,
    };
  }
};

// Update a note (title and/or content)
export const updateNote = async (
  id: string,
  updates: {
    title?: string;
    content?: any;
  }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to update note",
      };
    }

    // Validate note ID format
    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid note ID format",
      };
    }

    const db = await connectDB();

    // Get the note
    const note = await db.collection("notes").findOne({
      _id: new ObjectId(id),
    });

    if (!note) {
      return {
        success: false,
        message: "Note not found",
      };
    }

    // Verify the note's notebook belongs to the user
    const notebook = await db.collection("notebooks").findOne({
      _id: note.notebookId,
      userId,
    });

    if (!notebook) {
      return {
        success: false,
        message: "You don't have permission to update this note",
      };
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (updates.title !== undefined) {
      updateData.title = updates.title;
    }

    if (updates.content !== undefined) {
      updateData.content = updates.content;
    }

    await db.collection("notes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return {
      success: true,
      message: "Note updated successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error updating note",
    };
  }
};

// Delete a note
export const deleteNote = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to delete note",
      };
    }

    // Validate note ID format
    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid note ID format",
      };
    }

    const db = await connectDB();

    // Get the note
    const note = await db.collection("notes").findOne({
      _id: new ObjectId(id),
    });

    if (!note) {
      return {
        success: false,
        message: "Note not found",
      };
    }

    // Verify the note's notebook belongs to the user
    const notebook = await db.collection("notebooks").findOne({
      _id: note.notebookId,
      userId,
    });

    if (!notebook) {
      return {
        success: false,
        message: "You don't have permission to delete this note",
      };
    }

    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });

    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error deleting note",
    };
  }
};

// Optional: Delete all notes in a notebook (useful when deleting a notebook)
export const deleteNotesByNotebookId = async (notebookId: string) => {
  try {
    // Validate notebookId format
    if (!ObjectId.isValid(notebookId)) {
      return {
        success: false,
        message: "Invalid notebook ID format",
      };
    }

    const db = await connectDB();
    const result = await db.collection("notes").deleteMany({
      notebookId: new ObjectId(notebookId),
    });

    return {
      success: true,
      message: `${result.deletedCount} notes deleted successfully`,
      deletedCount: result.deletedCount,
    };
  } catch (err) {
    const e = err as Error;
    return {
      success: false,
      message: e.message || "Error deleting notes",
    };
  }
};