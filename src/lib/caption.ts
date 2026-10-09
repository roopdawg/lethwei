/**
 * v1: templated, zero extra API cost/credential beyond what the pipeline
 * already needs. Swap the body of this function for a real Claude call
 * later for per-design captions — everything downstream just consumes the
 * returned string either way.
 */
export function generateCaption(opts: { productName: string }): string {
  const templates = [
    `New drop: ${opts.productName}. The art of 9 limbs, worn. 🥋`,
    `${opts.productName} — forged in the tradition, built for the gym. Link in bio.`,
    `Out now: ${opts.productName}. No gloves. No mercy. Shop the gear — link in bio.`,
  ];
  const pick = templates[Math.floor(Math.random() * templates.length)];
  return `${pick}\n\n#lethwei #bareknuckle #martialarts #9limbs`;
}
