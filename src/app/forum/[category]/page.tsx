import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return {};
  return { title: `${cat.name} — Lethwei Forum` };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) notFound();

  const threads = await prisma.thread.findMany({
    where: { categoryId: cat.id },
    include: { user: { select: { username: true } }, replies: { select: { id: true } } },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
      {/* Header */}
      <div className="mb-8">
        <Link href="/forum" className="text-sm mb-4 inline-block" style={{ color: "var(--text-muted)" }}>
          ← Forum
        </Link>
        <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase" style={{ color: "var(--text)" }}>
          {cat.icon} {cat.name}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{cat.description}</p>
      </div>

      <Link
        href={`/forum/new-thread?category=${cat.slug}`}
        className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm px-5 py-2.5 inline-block mb-8 transition-colors"
        style={{ background: "var(--red)", color: "var(--text)" }}
      >
        + New Thread
      </Link>

      {threads.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No threads yet. Be the first.</p>
      ) : (
        <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/forum/${cat.slug}/${t.id}`}
              className="flex items-start gap-4 p-5 group transition-colors"
              style={{ background: "var(--surface)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {t.pinned && (
                    <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: "var(--gold)", color: "#000" }}>
                      Pinned
                    </span>
                  )}
                  <h2 className="font-semibold truncate group-hover:underline" style={{ color: "var(--text)" }}>
                    {t.title}
                  </h2>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  by {t.user.username} · {new Date(t.createdAt).toLocaleDateString()} · {t.replies.length} replies
                </p>
              </div>
              <span style={{ color: "var(--text-dim)" }} className="group-hover:text-[#888] transition-colors mt-1">→</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
