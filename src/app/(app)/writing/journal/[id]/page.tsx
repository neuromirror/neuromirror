import { EntryEditor } from "@/components/entry-editor";

export const metadata = { title: "Journal" };

export default async function JournalPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const [{ id }, { date }] = await Promise.all([params, searchParams]);
  return <EntryEditor key={id} kind="journal" id={id} presetDate={date ?? null} />;
}
