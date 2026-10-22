import { prisma } from "@/lib/prisma";

export type Tally = {
  designId: string;
  label: string;
  count: number;
}[];

/** Vote counts per design within a batch, sorted highest first. */
export async function tallyBatch(batchLabel: string): Promise<Tally> {
  const designs = await prisma.design.findMany({
    where: { batchLabel },
    select: { id: true, label: true, _count: { select: { votes: true } } },
  });
  return designs
    .map((d) => ({ designId: d.id, label: d.label, count: d._count.votes }))
    .sort((a, b) => b.count - a.count);
}

/**
 * The design(s) tied for the most votes. Length 1 means a clean winner;
 * length > 1 means a tie that needs the AI tiebreaker; length 0 means no
 * votes cast yet.
 */
export function leaders(tally: Tally): Tally {
  if (tally.length === 0 || tally[0].count === 0) return [];
  const top = tally[0].count;
  return tally.filter((t) => t.count === top);
}

/**
 * Claude picks among tied designs — reuses the same Anthropic client
 * convention as src/lib/claude-design.ts (separate ANTHROPIC_API_KEY,
 * same "not configured" guard). Returns the chosen design's id and a short
 * reason, stored on Design.aiTiebreakReason.
 */
export async function breakTie(
  batchLabel: string,
  tiedDesignIds: string[]
): Promise<{ designId: string; reason: string } | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const tied = await prisma.design.findMany({
    where: { id: { in: tiedDesignIds } },
    select: { id: true, label: true, prompt: true },
  });

  const prompt = `The monthly LETHWEI design panel tied for batch ${batchLabel}. Tied candidates:\n${tied
    .map((d) => `- ${d.label} (id ${d.id}): ${d.prompt}`)
    .join("\n")}\n\nPick exactly one to break the tie. Respond with ONLY the winning id on the first line, then a one-sentence reason on the second line.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude tiebreak call responded ${res.status}`);

  const json = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = json.content?.find((c) => c.type === "text")?.text?.trim() ?? "";
  const [idLine, ...rest] = text.split("\n");
  const designId = idLine.trim();
  if (!tiedDesignIds.includes(designId)) return null;

  return { designId, reason: rest.join(" ").trim() || "No reason given." };
}
