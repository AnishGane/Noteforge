import PageWrapper from "@/components/page-wrapper";
import RichTextEditor from "@/components/rich-text-editor";
import { getNoteById } from "@/server/note";

type Params = {
  noteId: string;
};

async function NotePage({ params }: { params: Params }) {
  const { noteId } = await params;
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
          path: `/dashboard/note/${noteId}`,
        },
      ]}
    >
      <h1>{note?.data?.title}</h1>
      <RichTextEditor content={note?.data?.note?.content} noteId={noteId} />
    </PageWrapper>
    // <h1>Hello</h1>
  );
}

export default NotePage;
