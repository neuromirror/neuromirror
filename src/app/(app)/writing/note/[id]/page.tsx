import { EntryEditor } from "@/components/entry-editor";

export const metadata = { title: "Note" };

export default async function NotePage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notebook?: string }>;
}) {
  const [{ id }, { notebook }] = await Promise.all([params, searchParams]);
  return <EntryEditor key={id} kind="note" id={id} presetDate={null} presetNotebook={notebook ?? null} />;
}
