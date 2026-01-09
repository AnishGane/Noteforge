import { CreateNoteButton } from "@/components/create-note-button";
import NoteCard from "@/components/note-card";
import PageWrapper from "@/components/page-wrapper";
import { getNoteBookById } from "@/server/notebook";

type Params = {
  notebookId: string;
};

async function NotebookPage({ params }: { params: Params }) {
  const { notebookId } = await params;
  const notebook = await getNoteBookById(notebookId);
  return (
    <PageWrapper
      breadCrumbs={[
        { label: "Dashboard", path: "/dashboard" },
        {
          label: notebook?.data?.name ?? "NoteBook",
          path: `/dashboard/note/${notebook}`,
        },
      ]}
    >
      <h1>{notebook?.data?.name}</h1>

      <CreateNoteButton notebookId={notebookId} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {notebook?.data?.notes.map((note) => (
          <NoteCard
            key={note._id}
            note={{
              id: note._id.toString(),
              title: note.title,
              content: note.content,
              notebookId: notebookId,
            }}
          />
        ))}
      </div>
    </PageWrapper>
  );
}

export default NotebookPage;
