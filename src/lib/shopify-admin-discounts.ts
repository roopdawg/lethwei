/**
 * Shopify Admin API client for the moderator discount-code perk only. Not
 * to be confused with src/lib/shopify.ts (the Storefront client used by the
 * shop page) or src/lib/shopify-admin.ts (a separate, unrelated piece of
 * in-progress work on another branch) — this file owns nothing but the
 * three discount mutations below. Server-side only: never import this from
 * a "use client" file.
 *
 * Configured by SHOPIFY_STORE_DOMAIN (the same domain the Storefront client
 * uses) and SHOPIFY_ADMIN_TOKEN (new, Admin API access token with the
 * write_discounts scope). When either is missing, every function here
 * returns null/false instead of throwing, so a missing or bad Admin token
 * degrades the weekly mod-quota job gracefully — one Shopify failure never
 * breaks the check for every other moderator.
 */

const API_VERSION = "2025-07";

export function isShopifyAdminConfigured(): boolean {
  return !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_TOKEN);
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };
type UserError = { field: string[] | null; message: string };

async function adminGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) throw new Error("Shopify Admin API is not configured");

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify Admin API responded ${res.status}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Shopify Admin API returned no data");
  return json.data;
}

function throwOnUserErrors(userErrors: UserError[]) {
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join("; "));
}

const DISCOUNT_CREATE = /* GraphQL */ `
  mutation CreateModDiscount($input: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $input) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            codes(first: 1) {
              nodes {
                code
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export type ModDiscount = { id: string; code: string };

/**
 * Creates a 15%-off, store-wide, no-expiry discount code for one moderator
 * who is in good standing and doesn't have one yet. The code is deterministic
 * from the moderator's id (`MOD15-<last 6 chars of id, uppercased>`) so it's
 * stable and collision-free without a lookup. Returns null — never throws —
 * when the Admin API isn't configured or the request fails.
 */
export async function createModDiscountCode(moderatorId: string): Promise<ModDiscount | null> {
  if (!isShopifyAdminConfigured()) return null;
  const code = `MOD15-${moderatorId.slice(-6).toUpperCase()}`;
  try {
    const data = await adminGraphQL<{
      discountCodeBasicCreate: {
        codeDiscountNode: {
          id: string;
          codeDiscount: { codes: { nodes: { code: string }[] } };
        } | null;
        userErrors: UserError[];
      };
    }>(DISCOUNT_CREATE, {
      input: {
        title: `Moderator perk — ${code}`,
        code,
        startsAt: new Date().toISOString(),
        // No endsAt: this is a standing perk, not a time-boxed promo.
        customerSelection: { all: true },
        customerGets: {
          value: { percentage: 0.15 },
          items: { all: true },
        },
        appliesOncePerCustomer: false,
      },
    });
    const { codeDiscountNode, userErrors } = data.discountCodeBasicCreate;
    throwOnUserErrors(userErrors);
    const createdCode = codeDiscountNode?.codeDiscount.codes.nodes[0]?.code;
    if (!codeDiscountNode || !createdCode) throw new Error("Shopify returned no discount code");
    return { id: codeDiscountNode.id, code: createdCode };
  } catch (err) {
    console.error(
      "[shopify-admin-discounts] createModDiscountCode failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

const DISCOUNT_DEACTIVATE = /* GraphQL */ `
  mutation DeactivateModDiscount($id: ID!) {
    discountCodeDeactivate(id: $id) {
      codeDiscountNode {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Stops a moderator's discount code from working once they go on probation.
 * Returns false — never throws — when the Admin API isn't configured or the
 * request fails; the moderator still shows as "on probation" in the admin
 * page either way, since that status comes from the database, not Shopify.
 */
export async function deactivateDiscountCode(discountId: string): Promise<boolean> {
  if (!isShopifyAdminConfigured()) return false;
  try {
    const data = await adminGraphQL<{
      discountCodeDeactivate: {
        codeDiscountNode: { id: string } | null;
        userErrors: UserError[];
      };
    }>(DISCOUNT_DEACTIVATE, { id: discountId });
    throwOnUserErrors(data.discountCodeDeactivate.userErrors);
    return true;
  } catch (err) {
    console.error(
      "[shopify-admin-discounts] deactivateDiscountCode failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}

const DISCOUNT_ACTIVATE = /* GraphQL */ `
  mutation ActivateModDiscount($id: ID!) {
    discountCodeActivate(id: $id) {
      codeDiscountNode {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Restores a moderator's existing discount code once they clear a completed
 * week's quota again after having been on probation — the perk is one
 * reusable code per moderator, never reissued. Returns false — never
 * throws — on misconfiguration or failure.
 */
export async function activateDiscountCode(discountId: string): Promise<boolean> {
  if (!isShopifyAdminConfigured()) return false;
  try {
    const data = await adminGraphQL<{
      discountCodeActivate: {
        codeDiscountNode: { id: string } | null;
        userErrors: UserError[];
      };
    }>(DISCOUNT_ACTIVATE, { id: discountId });
    throwOnUserErrors(data.discountCodeActivate.userErrors);
    return true;
  } catch (err) {
    console.error(
      "[shopify-admin-discounts] activateDiscountCode failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}
