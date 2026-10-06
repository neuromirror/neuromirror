import { EntryEditor } from "@/components/entry-editor";

export const metadata = { title: "Note" };

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EntryEditor key={id} kind="note" id={id} presetDate={null} />;
}
