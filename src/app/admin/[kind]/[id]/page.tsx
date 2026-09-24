import { notFound } from "next/navigation";
import { getAdminRepository } from "@/lib/admin/repository";
import { getRepository } from "@/lib/data";
import type { AdminEntityKind } from "@/lib/data/repository";
import { EntityEditor } from "@/components/admin/EntityEditor";
import { requireAdminPage } from "../../guard";

const kinds: AdminEntityKind[] = ["concepts", "philosophers", "schools", "categories", "works", "periods"];

export default async function AdminEdit({ params, searchParams }: { params: Promise<{ kind: string; id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdminPage();
  const { kind, id } = await params;
  if (!kinds.includes(kind as AdminEntityKind)) notFound();
  const { saved } = await searchParams;
  const repo = getAdminRepository();
  const entity = id === "new" ? null : await repo.get(kind as AdminEntityKind, id);
  if (id !== "new" && !entity) notFound();
  const content = getRepository();
  const [periods, philosophers] = await Promise.all([content.listPeriods("en"), content.listPhilosophers("en")]);
  return (
    <EntityEditor
      kind={kind as AdminEntityKind}
      entity={entity}
      writable={repo.writable}
      saved={saved === "1"}
      periodOptions={periods.map((p) => ({ id: p.id, label: p.t.title }))}
      philosopherOptions={philosophers.map((p) => ({ id: p.id, label: p.t.title }))}
    />
  );
}
