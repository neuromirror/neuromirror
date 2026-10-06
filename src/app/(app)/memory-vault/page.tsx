import { MemoryVault } from "@/components/memory-vault";

export const metadata = { title: "Memory Vault" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <MemoryVault initialQuery={(q ?? "").slice(0, 300)} />;
}
