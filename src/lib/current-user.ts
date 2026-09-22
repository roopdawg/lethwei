import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Actor } from "@/lib/permissions";

export type CurrentUser = Actor & { username: string; email: string };

/**
 * The signed-in user as the database sees them right now.
 *
 * Sessions are JWTs, so the role and banned flag baked into the token go
 * stale the moment an admin changes them. Anything that grants or denies a
 * permission must read the live row, not the token. Pages that only need to
 * decide which buttons to draw may use the session; routes that act must use
 * this.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, role: true, banned: true },
  });
  return user;
}
