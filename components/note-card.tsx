"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { JSONContent } from "@tiptap/react";
import { deleteNote } from "@/server/note";

interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: JSONContent;
}

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteNote(note.id);
      response.success
        ? (toast.success(response.message || "Note deleted successfully"),
          router.refresh(),
          setIsOpen(false))
        : toast.error(response.message);
    } catch (error) {
      const e = error as Error;
      toast.error("Failed to delete note" || e.message);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
      </CardHeader>

      {/* <CardContent>
        <p>{note?.content}</p>
      </CardContent> */}

      <CardFooter className="flex gap-6">
        <Link href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`} className="w-full">
          <Button variant="outline" className=" cursor-pointer w-full">
            View Note
          </Button>
        </Link>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="cursor-pointer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                Notebook and all its notes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={handleDelete}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
