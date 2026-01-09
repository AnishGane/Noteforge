import NoteCard from "@/components/note-card";
import PageWrapper from "@/components/page-wrapper";
import { getNoteBookById } from "@/server/notebook";

type Params = {
  notebookId: string;
};

async function NotebookPage({ params }: { params: Params }) {
  const { notebookId } = await params;
  const notebook = await getNoteBookById(notebookId);
  console.log(notebook);
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {notebook?.data?.notes.map((note) => (
          <NoteCard
            key={note.id}
            note={{
              id: note.id,
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
