import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canApproveDesign } from "@/lib/permissions";
import { listConfiguredProductTypes, getProductConfig } from "@/lib/printify";
import { DesignActions } from "./DesignActions";

export const metadata = {
  title: "Design Review — LETHWEI® Admin",
};

const sectionHeading = "font-[family-name:var(--font-oswald)] text-2xl uppercase mb-4";

function statusColor(status: string): string {
  if (status === "published") return "var(--gold)";
  if (status === "failed") return "var(--red)";
  if (status === "rejected") return "var(--text-dim)";
  return "var(--text-muted)";
}

export default async function DesignsAdminPage() {
  const user = await getCurrentUser();
  if (!canApproveDesign(user)) notFound();

  const designs = await prisma.design.findMany({
    orderBy: [{ batchLabel: "desc" }, { label: "asc" }],
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { username: true } } },
      },
    },
  });

  const batches = new Map<string, typeof designs>();
  for (const d of designs) {
    const list = batches.get(d.batchLabel) ?? [];
    list.push(d);
    batches.set(d.batchLabel, list);
  }

  const availableProductTypes = listConfiguredProductTypes();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24 flex flex-col gap-16">
      <div>
        <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase mb-2" style={{ color: "var(--text)" }}>
          Design Review
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          AI-generated design candidates, grouped by batch. Approve to publish to Printify/Shopify
          (and Instagram, once configured) on the garments selected below each one.
        </p>
      </div>

      {designs.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>
          No designs generated yet.
        </p>
      ) : (
        Array.from(batches.entries()).map(([batchLabel, batchDesigns]) => (
          <section key={batchLabel}>
            <h2 className={sectionHeading} style={{ color: "var(--text)" }}>
              Batch {batchLabel}
            </h2>

            <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
              {batchDesigns.map((design) => (
                <div key={design.id} className="flex flex-col gap-4 p-4" style={{ background: "var(--surface)" }}>
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.imageUrl}
                      alt={design.label}
                      className="w-32 h-32 object-contain shrink-0"
                      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                          {design.label}
                        </p>
                        <span className="text-xs uppercase tracking-widest" style={{ color: statusColor(design.status) }}>
                          {design.status}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{design.prompt}</p>
                      {design.publishError && (
                        <p className="text-xs mt-1" style={{ color: "var(--red)" }}>{design.publishError}</p>
                      )}
                    </div>
                  </div>

                  {design.comments.length > 0 && (
                    <div className="flex flex-col gap-2 pl-4 border-l" style={{ borderColor: "var(--border)" }}>
                      {design.comments.map((c) => (
                        <p key={c.id} className="text-xs" style={{ color: "var(--text-muted)" }}>
                          <span style={{ color: "var(--text)" }}>{c.user.username}:</span> {c.body}
                        </p>
                      ))}
                    </div>
                  )}

                  <DesignActions
                    designId={design.id}
                    status={design.status}
                    productTypes={design.productTypes}
                    availableProductTypes={availableProductTypes.map((key) => ({
                      key,
                      label: getProductConfig(key)?.label ?? key,
                    }))}
                  />
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
