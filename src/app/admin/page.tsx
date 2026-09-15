import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { canSeeAdminArea, isAdmin } from "@/lib/permissions";
import { PendingGymActions, RevokeGymAction } from "./GymActions";
import { UserRow } from "./UserRow";
import { CategoryRow } from "./CategoryRow";
import { AddCategoryForm } from "./AddCategoryForm";

export const metadata = {
  title: "Admin — LETHWEI®",
};

const sectionHeading =
  "font-[family-name:var(--font-oswald)] text-2xl uppercase mb-4";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!canSeeAdminArea(user)) notFound();

  const [pendingGyms, approvedGyms] = await Promise.all([
    prisma.gym.findMany({ where: { approved: false }, orderBy: { createdAt: "asc" } }),
    prisma.gym.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const admin = isAdmin(user);
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const users = admin
    ? await prisma.user.findMany({
        where: query
          ? {
              OR: [
                { username: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
        take: query ? 50 : 20,
      })
    : [];

  const categories = admin
    ? await prisma.category.findMany({ orderBy: { order: "asc" } })
    : [];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24 flex flex-col gap-16">
      <div>
        <h1 className="font-[family-name:var(--font-oswald)] text-4xl uppercase mb-2" style={{ color: "var(--text)" }}>
          Admin
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Signed in as {user!.username} ({user!.role})
        </p>
      </div>

      {/* Gym submissions */}
      <section>
        <h2 className={sectionHeading} style={{ color: "var(--text)" }}>Gym submissions</h2>

        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
          Pending ({pendingGyms.length})
        </h3>
        {pendingGyms.length === 0 ? (
          <p className="text-sm mb-8" style={{ color: "var(--text-dim)" }}>No pending submissions.</p>
        ) : (
          <div className="flex flex-col gap-px mb-8" style={{ background: "var(--border)" }}>
            {pendingGyms.map((gym) => (
              <div key={gym.id} className="flex items-start justify-between gap-4 p-4" style={{ background: "var(--surface)" }}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{gym.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{gym.city}, {gym.state}, {gym.country}</p>
                  {gym.description && (
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{gym.description}</p>
                  )}
                </div>
                <PendingGymActions gymId={gym.id} />
              </div>
            ))}
          </div>
        )}

        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
          Approved ({approvedGyms.length})
        </h3>
        {approvedGyms.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>No approved gyms yet.</p>
        ) : (
          <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
            {approvedGyms.map((gym) => (
              <div key={gym.id} className="flex items-center justify-between gap-4 p-4" style={{ background: "var(--surface)" }}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{gym.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{gym.city}, {gym.state}, {gym.country}</p>
                </div>
                <RevokeGymAction gymId={gym.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users */}
      {admin && (
        <section>
          <h2 className={sectionHeading} style={{ color: "var(--text)" }}>Users</h2>

          <form action="/admin" method="get" className="mb-4 flex gap-2">
            <input
              name="q"
              defaultValue={query}
              placeholder="Search by username or email…"
              className="flex-1 px-4 py-2.5 rounded text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold rounded transition-colors"
              style={{ background: "var(--red)", color: "var(--text)" }}
            >
              Search
            </button>
          </form>

          {users.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>No users found.</p>
          ) : (
            <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
              {users.map((u) =>
                u.id === user!.id ? (
                  <div key={u.id} className="flex items-center gap-4 p-4" style={{ background: "var(--surface)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{u.username} (you)</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>{u.role}</span>
                  </div>
                ) : (
                  <UserRow key={u.id} id={u.id} username={u.username} email={u.email} role={u.role} banned={u.banned} />
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* Categories */}
      {admin && (
        <section>
          <h2 className={sectionHeading} style={{ color: "var(--text)" }}>Categories</h2>

          {categories.length === 0 ? (
            <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>No categories yet.</p>
          ) : (
            <div className="flex flex-col gap-px mb-6" style={{ background: "var(--border)" }}>
              {categories.map((c) => (
                <CategoryRow
                  key={c.id}
                  id={c.id}
                  name={c.name}
                  slug={c.slug}
                  description={c.description}
                  icon={c.icon}
                  order={c.order}
                />
              ))}
            </div>
          )}

          <AddCategoryForm />
        </section>
      )}
    </main>
  );
}
