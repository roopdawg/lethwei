import { Resvg } from "@resvg/resvg-js";

/** Rasterizes SVG markup to a PNG buffer — needed because neither Printify's
 * base64 upload nor Instagram's media API can consume raw SVG. */
export function rasterizeSvgToPng(svgMarkup: string, width = 2000): Buffer {
  const resvg = new Resvg(svgMarkup, { fitTo: { mode: "width", value: width } });
  return resvg.render().asPng();
}
