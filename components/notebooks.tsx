export default function NoteBooks({ name, key }: { name: string, key: string }) {
  return <div key={key}>NoteBook name: {name}</div>;
}
