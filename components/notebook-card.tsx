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
import { deleteNoteBook } from "@/server/notebook";
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

interface Notebook {
  id: string;
  name: string;
  notesCount: number;
  createdAt: Date;
}

interface NoteBookCardProps {
  notebook: Notebook;
}

export default function NoteBookCard({ notebook }: NoteBookCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteNoteBook(notebook.id);
      response.success
        ? (toast.success(response.message || "Notebook deleted successfully"),
          router.refresh(),
          setIsOpen(false))
        : toast.error(response.message);
    } catch (error) {
      const e = error as Error;
      toast.error("Failed to delete notebook" || e.message);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex lg:items-center flex-row  md:flex-col lg:flex-row justify-between">
          <CardTitle>{notebook.name}</CardTitle>
          <p className="text-muted-foreground text-[10px]">
            {new Date(notebook.createdAt).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit", // only hours and minutes
              hour12: true, // shows AM/PM
            })}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm">Notes: {notebook.notesCount}</p>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Link href={`/dashboard/notebook/${notebook.id}`} className="w-full">
          <Button variant="outline" className=" cursor-pointer w-full">
            View Notebook
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
