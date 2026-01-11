import PageWrapper from "@/components/page-wrapper";
import RichTextEditor from "@/components/rich-text-editor";
import { getNoteById } from "@/server/note";
import { JSONContent } from "@tiptap/react";

type Params = {
  noteId: string;
  notebookId: string;
};

async function NotePage({ params }: { params: Params }) {
  const { noteId, notebookId } = await params;
  
  const note = await getNoteById(noteId);
  return (
    <PageWrapper
      breadCrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        {
          label: note?.data?.notebookName ?? "NoteBook",
          path: `/dashboard/notebook/${note?.data?.notebookId}`,
        },
        {
          label: note?.data?.title ?? "Note",
          path: `/dashboard/notebook/${notebookId}/note/${noteId}`,
        },
      ]}
    >
      <h1>{note?.data?.title}</h1>
      <RichTextEditor
        content={note?.data?.content as JSONContent}
        noteId={noteId}
      />
    </PageWrapper>
  );
}

export default NotePage;
