import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReplyForm from "./ReplyForm";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; threadId: string }>;
}) {
  const { category, threadId } = await params;
  const session = await auth();

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      user: { select: { username: true } },
      category: true,
      replies: {
        include: { user: { select: { username: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread || thread.category.slug !== category) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        <Link href="/forum">Forum</Link>
        <span>/</span>
        <Link href={`/forum/${category}`}>{thread.category.name}</Link>
      </div>

      {/* Thread */}
      <article className="p-6 mb-8 rounded" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <h1 className="font-[family-name:var(--font-oswald)] text-3xl mb-2" style={{ color: "var(--text)" }}>
          {thread.title}
        </h1>
        <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
          by {thread.user.username} · {new Date(thread.createdAt).toLocaleDateString()}
        </p>
        <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>
          {thread.body}
        </div>
      </article>

      {/* Replies */}
      {thread.replies.length > 0 && (
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-oswald)] text-lg uppercase mb-4" style={{ color: "var(--text-muted)" }}>
            {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
          </h2>
          <div className="flex flex-col gap-4">
            {thread.replies.map((r) => (
              <div key={r.id} className="p-4 rounded" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                  {r.user.username} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reply form */}
      {session ? (
        <ReplyForm threadId={thread.id} />
      ) : (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/auth/signin" style={{ color: "var(--gold)" }}>Sign in</Link> to reply.
        </p>
      )}
    </main>
  );
}
