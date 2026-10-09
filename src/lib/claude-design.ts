/**
 * Claude-generated vector artwork for product designs. Claude writes the SVG
 * directly as markup (it's just XML) — genuinely vector, no raster-to-vector
 * tracing step, and no separate design-gen vendor. Trade-off vs. a
 * diffusion model (e.g. Recraft): output reads as bolder/more geometric
 * line-art, not painterly illustration — Gabe is expected to do real
 * editing, not just approve as-is.
 *
 * Each design embeds the site's own visual identity so every batch is
 * on-brand by default without the admin having to redescribe it each time.
 */
const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";

export function isClaudeDesignConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

const BRAND_BRIEF = `
Brand: LETHWEI — a dark, gothic bare-knuckle martial arts apparel line (lethwei.com).
Visual identity to match:
- Palette: blood red #C41E1E, gold #D4A017, off-white #F5F0E8, near-black #0A0A0A. Use 2-4 of these as flat, bold color regions — no gradients, no photorealism.
- Recurring motifs: anatomical skulls, the "9 weapons" (fists, elbows, knees, kicks, headbutts), a circular emblem with radiating lines, gothic blackletter-adjacent lettering, Burmese-script-inspired linework, warrior/combat imagery. Never generic MMA clipart.
- Mood: brutal, traditional, "forged in Myanmar" — not a modern streetwear logo, not cute, not corporate.
- Must work as a bold all-over or large-placement print: clean closed paths, limited color count, strong silhouette readable at a distance.
`.trim();

type GeneratedDesign = { label: string; prompt: string; svgMarkup: string; imageUrl: string };

function labelFor(index: number): string {
  // A, B, C, ... Z, then AA, AB... (won't realistically be needed, but no
  // silent failure past 26 the way a hardcoded A-Z array would have).
  let n = index;
  let out = "";
  do {
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return `Design ${out}`;
}

function extractSvg(text: string): string | null {
  const match = text.match(/<svg[\s\S]*?<\/svg>/i);
  return match ? match[0] : null;
}

function toDataUri(svgMarkup: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svgMarkup, "utf-8").toString("base64")}`;
}

async function generateOne(brief: string): Promise<{ svgMarkup: string; prompt: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const userPrompt = `${BRAND_BRIEF}\n\nDesign brief for this specific piece: ${brief}\n\nRespond with ONLY a single complete <svg>...</svg> document (viewBox="0 0 1000 1000", no external fonts/images/scripts) and nothing else — no prose, no markdown fences.`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Claude API responded ${res.status}: ${text}`);
  }
  const json = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = json.content?.find((c) => c.type === "text")?.text ?? "";
  const svgMarkup = extractSvg(text);
  if (!svgMarkup) throw new Error("Claude response did not contain an <svg> document");

  return { svgMarkup, prompt: brief };
}

/**
 * Generates `count` distinct design concepts for the given batch brief
 * (e.g. "men's and women's fight shorts"). Each call is independent so one
 * failure doesn't take down the whole batch — failures are thrown per-call
 * and the caller decides whether to retry or skip.
 */
export async function generateDesigns(
  batchBrief: string,
  count: number
): Promise<GeneratedDesign[]> {
  const results: GeneratedDesign[] = [];
  for (let i = 0; i < count; i++) {
    const variation = `${batchBrief} (concept ${i + 1} of ${count} — make this one visually distinct from the others in the batch, not a minor palette swap)`;
    const { svgMarkup, prompt } = await generateOne(variation);
    results.push({
      label: labelFor(i),
      prompt,
      svgMarkup,
      imageUrl: toDataUri(svgMarkup),
    });
  }
  return results;
}
