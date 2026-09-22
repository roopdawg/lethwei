import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canPost } from "@/lib/permissions";
import NewThreadForm from "./NewThreadForm";

export default async function NewThreadPage() {
  const user = await getCurrentUser();

  // Signed-out visitors still get the form: submitting sends them to sign up
  // with the draft preserved. Only a banned account is turned away here.
  if (user && !canPost(user)) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24">
        <Link href="/forum" className="text-sm mb-6 inline-block" style={{ color: "var(--text-muted)" }}>
          ← Forum
        </Link>
        <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase mb-8" style={{ color: "var(--text)" }}>
          New Thread
        </h1>
        <p data-testid="cant-post-notice" className="text-sm" style={{ color: "var(--text-muted)" }}>
          Your account can&apos;t post.
        </p>
      </main>
    );
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <Suspense>
      <NewThreadForm categories={categories} />
    </Suspense>
  );
}
