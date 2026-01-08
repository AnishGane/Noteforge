"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export const createNoteBook = async (name: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

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
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      
      const userId = session?.user?.id;
      
      if (!userId) {
        return {
          success: false,
          message: "Please login to view notebooks",
          data: { notebooks: [], notes: [] },
        };
      }
      
      const db = await connectDB();
      
      // Get all notebooks for the user
      const notebooks = await db
        .collection("notebooks")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
  
      // Get all notes for all notebooks
      const notebookIds = notebooks.map((notebook) => notebook._id);
      const notes = await db
        .collection("notes")
        .find({ notebookId: { $in: notebookIds } })
        .sort({ updatedAt: -1 })
        .toArray();
  
      return {
        success: true,
        message: "Notebooks fetched successfully",
        data: {
          notebooks,
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

export const getNoteBookById = async (id: string) => {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return {
        success: false,
        message: "Invalid notebook ID format",
        data: null,
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Please login to view notebook",
        data: null,
      };
    }

    const db = await connectDB();

    // Get the notebook
    const notebook = await db.collection("notebooks").findOne({
      _id: new ObjectId(id),
      userId, // Ensure user owns this notebook
    });

    if (!notebook) {
      return {
        success: false,
        message: "Notebook not found or you don't have permission",
        data: null,
      };
    }

    // Get all notes for this notebook
    const notes = await db
      .collection("notes")
      .find({ notebookId: new ObjectId(id) })
      .sort({ updatedAt: -1 })
      .toArray();

    return {
      success: true,
      message: "Notebook fetched successfully",
      data: {
        ...notebook,
        notes,
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
