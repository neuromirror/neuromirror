import { WritingLibrary, type WritingView } from "@/components/writing-library";

const VIEWS: WritingView[] = ["journals", "notes", "favorites", "archive", "tags", "notebooks"];

export const metadata = { title: "Writing" };

export default async function WritingPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const view = VIEWS.includes(sp.view as WritingView) ? (sp.view as WritingView) : "journals";
  return <WritingLibrary view={view} tag={sp.tag ?? null} notebook={sp.notebook ?? null} />;
}
