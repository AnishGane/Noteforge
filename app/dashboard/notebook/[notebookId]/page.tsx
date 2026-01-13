import { CreateNoteButton } from "@/components/create-note-button";
import NoteCard from "@/components/note-card";
import PageWrapper from "@/components/page-wrapper";
import { getNoteBookById } from "@/server/notebook";
import { JSONContent } from "@tiptap/react";

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
          path: `/dashboard/notebook/${notebookId}`,
        },
      ]}
    >
      <CreateNoteButton notebookId={notebookId} />
      <div className="w-full">
        {notebook?.data?.notes?.length! > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {notebook?.data?.notes
              ? notebook?.data?.notes.map((note) => (
                  <NoteCard
                    key={note._id.toString()}
                    note={{
                      id: note._id.toString(),
                      title: note.title,
                      content: note.content,
                      notebookId: notebookId,
                    }}
                  />
                ))
              : null}
          </div>
        ) : (
          <div className=" mx-auto w-full mt-6">
            <p className="text-muted-foreground text-center text-sm">
              Add some notes to see here
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default NotebookPage;
