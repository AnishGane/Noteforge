import { CreateNoteBookButton } from "@/components/create-notebook-button";
import NoteBooks from "@/components/notebooks";
import PageWrapper from "@/components/page-wrapper";
import { getNoteBooks } from "@/server/notebook";

export default async function Page() {
  const notebooks = await getNoteBooks();
  
  return (
    <PageWrapper breadCrumbs={[{ label: "Dashboard", path: "/dashboard" }]}>
      <h1>NoteBook</h1>

      <CreateNoteBookButton />

      {notebooks.success &&
        notebooks.data.notebooks.map((notebook, idx) => (
          <NoteBooks 
            name={notebook.name} 
            key={notebook._id.toString()} 
          />
        ))}

      {notebooks.success && notebooks.data.notebooks.length === 0 && (
        <p>No notebooks found</p>
      )}
      
      {!notebooks.success && (
        <p className="text-red-500">{notebooks.message}</p>
      )}
    </PageWrapper>
  );
}