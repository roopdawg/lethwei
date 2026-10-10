/**
 * Transactional email via Resend's HTTP API — plain fetch, no SDK, same
 * convention as every other external client in this codebase. No email
 * infrastructure existed before this; needs RESEND_API_KEY (and ideally a
 * verified sending domain for lethwei.com) before anything actually sends.
 */
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`[email] RESEND_API_KEY not set — would have sent to ${to}: ${subject}`);
    return;
  }

  const from = process.env.RESEND_FROM_ADDRESS || "LETHWEI <noreply@lethwei.com>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${body}`);
  }
}
