import { CreateNoteBookButton } from "@/components/create-notebook-button";
import NoteBookCard from "@/components/notebook-card";
import PageWrapper from "@/components/page-wrapper";
import { getNoteBooks } from "@/server/notebook";

export default async function Page() {
  const notebooks = await getNoteBooks();
  // console.log(notebooks);
  return (
    <PageWrapper breadCrumbs={[{ label: "Dashboard", path: "/dashboard" }]}>
      <h1>Notebook</h1>

      <CreateNoteBookButton />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {notebooks.success &&
          notebooks.data.notebooks.map((notebook) => (
            <NoteBookCard
              key={notebook._id.toString()}
              notebook={{
                id: notebook._id.toString(),
                name: notebook.name,
                notesCount: notebook.notesCount,
              }}
            />
          ))}
      </div>

      {notebooks.success && notebooks.data.notebooks.length === 0 && (
        <p>No notebooks found</p>
      )}

      {!notebooks.success && (
        <p className="text-red-500">{notebooks.message}</p>
      )}
    </PageWrapper>
  );
}
