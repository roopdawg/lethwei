import { prisma } from "@/lib/prisma";
import {
  uploadImageBase64,
  createAndPublishProduct,
  isPrintifyConfigured,
  getProductConfig,
} from "@/lib/printify";
import {
  publishToHeadlessChannel,
  findShopifyProductGidByTitle,
  getProductImageUrl,
  isShopifyAdminConfigured,
} from "@/lib/shopify-admin";
import { postImage, isInstagramConfigured } from "@/lib/instagram";
import { generateCaption } from "@/lib/caption";
import { rasterizeSvgToPng } from "@/lib/svg-raster";
import type { Design } from "@prisma/client";

type ProductTypeResult = {
  status: "published" | "failed";
  printifyProductId?: string;
  shopifyProductId?: string;
  instagramPostId?: string;
  error?: string;
};

/**
 * Runs after an admin approves a design: for every garment type selected on
 * it (e.g. a design approved for both "mens-shorts" and "womens-shorts"),
 * create+publish a Printify product from the same artwork, fix the
 * Headless-channel gap, then post to Instagram. Each garment type's result
 * is recorded independently in `publishResults` — one failing type (e.g. a
 * bad blueprint config) doesn't take the rest of the batch down with it.
 */
export async function publishDesign(design: Design): Promise<void> {
  if (!isPrintifyConfigured() || !isShopifyAdminConfigured()) {
    await prisma.design.update({
      where: { id: design.id },
      data: {
        status: "failed",
        publishError: "Printify/Shopify Admin API credentials are not configured yet.",
      },
    });
    return;
  }

  await prisma.design.update({ where: { id: design.id }, data: { status: "publishing" } });

  const results: Record<string, ProductTypeResult> = {};

  let printifyImageId: string | null = null;
  try {
    if (design.svgMarkup) {
      const png = rasterizeSvgToPng(design.svgMarkup);
      printifyImageId = await uploadImageBase64(png.toString("base64"), `${design.id}.png`);
    }
  } catch (err) {
    await prisma.design.update({
      where: { id: design.id },
      data: {
        status: "failed",
        publishError: `Artwork upload failed: ${err instanceof Error ? err.message : "unknown error"}`,
      },
    });
    return;
  }

  for (const productType of design.productTypes) {
    const config = getProductConfig(productType);
    if (!config) {
      results[productType] = { status: "failed", error: `No PRINTIFY_PRODUCT_CONFIG entry for "${productType}"` };
      continue;
    }
    if (!printifyImageId) {
      results[productType] = { status: "failed", error: "No artwork was uploaded (missing svgMarkup)" };
      continue;
    }

    const title = `LETHWEI® ${design.label} — ${config.label}`;
    try {
      const { productId } = await createAndPublishProduct({
        title,
        description: design.prompt,
        blueprintId: config.blueprintId,
        printProviderId: config.printProviderId,
        variantIds: config.variantIds,
        printAreaImageId: printifyImageId,
      });

      // Printify's own Shopify publish is async — give it a few seconds
      // before looking the product up by title to fix the sales channel.
      await new Promise((resolve) => setTimeout(resolve, 8000));
      const shopifyGid = await findShopifyProductGidByTitle(title);
      if (shopifyGid) {
        await publishToHeadlessChannel(shopifyGid);
      }

      let instagramPostId: string | undefined;
      if (isInstagramConfigured() && shopifyGid) {
        const imageUrl = await getProductImageUrl(shopifyGid);
        if (imageUrl) {
          const caption = generateCaption({ productName: title });
          instagramPostId = await postImage(imageUrl, caption);
        }
      }

      results[productType] = {
        status: "published",
        printifyProductId: productId,
        shopifyProductId: shopifyGid ?? undefined,
        instagramPostId,
      };
    } catch (err) {
      results[productType] = {
        status: "failed",
        error: err instanceof Error ? err.message : "unknown error",
      };
    }
  }

  const anyPublished = Object.values(results).some((r) => r.status === "published");
  const allFailed = Object.values(results).every((r) => r.status === "failed");

  await prisma.design.update({
    where: { id: design.id },
    data: {
      status: anyPublished ? "published" : "failed",
      publishResults: results,
      publishError: allFailed
        ? Object.entries(results)
            .map(([type, r]) => `${type}: ${r.error}`)
            .join("; ")
        : null,
    },
  });
}
