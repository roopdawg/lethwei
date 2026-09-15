import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import NewThreadForm from "./NewThreadForm";

export default async function NewThreadPage() {
  const session = await auth();
  const banned = session?.user?.banned === true;

  if (banned) {
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

  return (
    <Suspense>
      <NewThreadForm />
    </Suspense>
  );
}
