import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReplyForm from "./ReplyForm";
import ThreadControls from "./ThreadControls";
import ReplyControls from "./ReplyControls";
import {
  canDeletePost,
  canEditPost,
  canLockThread,
  canPinThread,
  canReply,
  type Actor,
} from "@/lib/permissions";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; threadId: string }>;
}) {
  const { category, threadId } = await params;
  // Live row, not the JWT: a ban or promotion shows on the next page load.
  const user = await getCurrentUser();

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

  const actor: Actor | null = user;

  const threadState = { locked: thread.locked };
  const canEditThread = canEditPost(actor, { userId: thread.userId }, threadState);
  const canDeleteThread = canDeletePost(actor, { userId: thread.userId });
  const canPin = canPinThread(actor);
  const canLock = canLockThread(actor);
  const replyAllowed = actor ? canReply(actor, threadState) : false;

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
        <ThreadControls
          threadId={thread.id}
          categorySlug={category}
          title={thread.title}
          body={thread.body}
          authorUsername={thread.user.username}
          createdAtLabel={new Date(thread.createdAt).toLocaleDateString()}
          locked={thread.locked}
          pinned={thread.pinned}
          edited={Boolean(thread.editedAt)}
          canEdit={canEditThread}
          canDelete={canDeleteThread}
          canPin={canPin}
          canLock={canLock}
        />
      </article>

      {/* Replies */}
      {thread.replies.length > 0 && (
        <section className="mb-8">
          <h2 className="font-[family-name:var(--font-oswald)] text-lg uppercase mb-4" style={{ color: "var(--text-muted)" }}>
            {thread.replies.length} {thread.replies.length === 1 ? "Reply" : "Replies"}
          </h2>
          <div className="flex flex-col gap-4">
            {thread.replies.map((r) => (
              <ReplyControls
                key={r.id}
                replyId={r.id}
                authorUsername={r.user.username}
                createdAtLabel={new Date(r.createdAt).toLocaleDateString()}
                body={r.body}
                edited={Boolean(r.editedAt)}
                canEdit={canEditPost(actor, { userId: r.userId }, threadState)}
                canDelete={canDeletePost(actor, { userId: r.userId })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Reply form */}
      {!user ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/auth/signin" style={{ color: "var(--gold)" }}>Sign in</Link> to reply.
        </p>
      ) : actor!.banned ? (
        <p data-testid="cant-post-notice" className="text-sm" style={{ color: "var(--text-muted)" }}>
          Your account can&apos;t post.
        </p>
      ) : !replyAllowed ? (
        <p data-testid="thread-locked-notice" className="text-sm" style={{ color: "var(--text-muted)" }}>
          This thread is locked.
        </p>
      ) : (
        <ReplyForm threadId={thread.id} />
      )}
    </main>
  );
}
