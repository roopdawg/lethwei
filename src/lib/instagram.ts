/**
 * Instagram Content Publishing API (Instagram Login path — no linked
 * Facebook Page needed, no App Review needed for single-account posting,
 * per the research done before building this). Needs a Business/Creator
 * account and a long-lived access token.
 */
const GRAPH_VERSION = "v21.0";

export function isInstagramConfigured(): boolean {
  return !!(process.env.INSTAGRAM_ACCOUNT_ID && process.env.INSTAGRAM_ACCESS_TOKEN);
}

export async function postImage(imageUrl: string, caption: string): Promise<string> {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accountId || !token) throw new Error("Instagram is not configured");

  const base = `https://graph.facebook.com/${GRAPH_VERSION}`;

  const containerRes = await fetch(
    `${base}/${accountId}/media?${new URLSearchParams({ image_url: imageUrl, caption, access_token: token })}`,
    { method: "POST" }
  );
  if (!containerRes.ok) {
    throw new Error(`Instagram media container failed: ${await containerRes.text()}`);
  }
  const { id: creationId } = (await containerRes.json()) as { id: string };

  const publishRes = await fetch(
    `${base}/${accountId}/media_publish?${new URLSearchParams({ creation_id: creationId, access_token: token })}`,
    { method: "POST" }
  );
  if (!publishRes.ok) {
    throw new Error(`Instagram publish failed: ${await publishRes.text()}`);
  }
  const { id: postId } = (await publishRes.json()) as { id: string };
  return postId;
}
