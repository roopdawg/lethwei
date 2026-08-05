import Link from "next/link";

export const metadata = {
  title: "Shop — LETHWEI™ Gear | T-Shirts, Hoodies & Hats",
  description: "Shop official LETHWEI™ t-shirts, hoodies and hats.",
};

// `views` is ordered: the first entry is what shows at rest, the second (if
// present) on hover. Every view is labelled so nobody has to guess whether
// they are looking at the front or the back.
//
// The Weapons Tee has BACK only — there is no front photograph of it yet.
// Add `{ src: "/weapons-tee-black-front.png", label: "Front" }` as the FIRST
// entry once one exists and the hover swap starts working automatically.
const products = [
  {
    id: "skull-tee",
    name: "LETHWEI™ Skull Tee",
    subtitle: "The Art of Nine Limbs",
    description: "Acid wash heavyweight tee. Anatomical skull on the front, 'the art of nine limbs' in gothic script across the back. The flagship design.",
    colorway: "Acid Wash Black",
    views: [
      { src: "/skull-tee-front.jpg", label: "Front" },
      { src: "/skull-tee-back.jpg", label: "Back" },
    ],
    tag: "Drop 01",
  },
  {
    id: "weapons-tee-blue",
    name: "LETHWEI™ Weapons Tee",
    subtitle: "Knee. Elbow. Knuckle. Shin. Skull.",
    description: "Myanmar flag and the LETHWEI™ oval on the chest, Burmese script across the front. Five weapons stacked in bold caps across the back. Sleeve print on the left arm.",
    colorway: "Light Blue",
    views: [
      { src: "/weapons-tee-blue-front.webp", label: "Front" },
      { src: "/weapons-tee-blue.png", label: "Back" },
    ],
    tag: "Drop 01",
  },
  {
    // Back only — no front photograph of the BLACK colourway yet. The light
    // blue front above is presumed to be the same artwork, but that is not
    // confirmed, so it is not reused here.
    id: "weapons-tee-black",
    name: "LETHWEI™ Weapons Tee",
    subtitle: "Knee. Elbow. Knuckle. Shin. Skull.",
    description: "Five weapons stacked in bold caps across the back of a clean black tee. LETHWEI™ label at the neck, sleeve print on the left arm.",
    colorway: "Black",
    views: [{ src: "/weapons-tee-black-back.webp", label: "Back" }],
    tag: "Drop 01",
  },
  {
    id: "skull-hoodie",
    name: "LETHWEI™ 9 Skull Hoodie",
    subtitle: "Nine Limbs. One Skull.",
    description: "Acid wash heavyweight hoodie. Small gothic lethwei script at the chest, anatomical skull ringed with the number nine across the back.",
    colorway: "Acid Wash Black",
    views: [
      { src: "/skull-hoodie-front.webp", label: "Front" },
      { src: "/skull-hoodie-back.webp", label: "Back" },
    ],
    tag: "Drop 01",
  },
  {
    id: "tiger-tee-blue",
    name: "LETHWEI™ Tiger Boxing Tee",
    subtitle: "Golden Tiger Boxing Club",
    description: "Tribute tee to Kyat Ba Nyein, who revived the sport in the 1950s. Hand-drawn portrait under a heavy gothic wordmark, on a washed blue camo body.",
    colorway: "Blue Camo",
    views: [{ src: "/tiger-tee-blue-front.webp", label: "Front" }],
    tag: "Drop 01",
  },
  {
    id: "tiger-tee-green",
    name: "LETHWEI™ Tiger Boxing Tee",
    subtitle: "Golden Tiger Boxing Club",
    description: "The same Kyat Ba Nyein portrait on a woodland camo body. Heavier, warmer, and built to take a beating.",
    colorway: "Green Camo",
    views: [{ src: "/tiger-tee-green-front.webp", label: "Front" }],
    tag: "Drop 01",
  },
];

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#110000] to-[#0A0A0A]" />
        <img
          src="/ghost-shop.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-8%] top-1/2 -translate-y-1/2 h-[130%] w-auto max-w-none opacity-60 hidden lg:block"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Drop 01 — Now Available
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] text-6xl md:text-8xl font-bold leading-none mb-6">
            WEAR THE<br />
            <span className="text-[#C41E1E]">TRADITION</span>
          </h1>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
          <p className="text-[#888888] text-lg max-w-xl leading-relaxed">
            Designed by Gabe Schnider. Acid wash, heavyweight, and built to last.
            DM <a href="https://instagram.com/lethweiofficial" target="_blank" rel="noopener noreferrer" className="text-[#D4A017] hover:text-[#F0C040] transition-colors">@lethweiofficial</a> to order while the online shop is being built.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-3 block">
            Official Gear
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-5xl font-bold leading-none text-[#F5F0E8]">
            LETHWEI<sup className="text-[0.4em] tracking-normal">™</sup> APPAREL
          </h2>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mt-5" />
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]">
          {products.map((product) => (
            <div key={product.id} className="bg-[#111111] group">
              {/* Image — first view at rest, second (if any) on hover */}
              <div className="relative aspect-square overflow-hidden bg-[#0A0A0A]">
                <img
                  src={product.views[0].src}
                  alt={`${product.name} — ${product.views[0].label.toLowerCase()}`}
                  className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-500 ${
                    product.views.length > 1 ? "group-hover:opacity-0" : ""
                  }`}
                />
                {product.views[1] && (
                  <img
                    src={product.views[1].src}
                    alt={`${product.name} — ${product.views[1].label.toLowerCase()}`}
                    className="w-full h-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100 absolute inset-0"
                  />
                )}

                {/* Which side am I looking at? */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 transition-opacity duration-500 ${
                      product.views.length > 1 ? "group-hover:opacity-0" : ""
                    }`}
                  >
                    {product.views[0].label}
                  </span>
                  {product.views[1] && (
                    <span className="font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 absolute left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {product.views[1].label}
                    </span>
                  )}
                </div>

                {product.views.length > 1 && (
                  <span className="absolute bottom-3 right-3 text-[#555555] text-[10px] tracking-widest uppercase group-hover:opacity-0 transition-opacity duration-500">
                    Hover for back
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-6 border-t border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-xs tracking-[0.3em] uppercase">
                    {product.tag}
                  </span>
                  <span className="font-[family-name:var(--font-oswald)] text-[#555555] text-xs tracking-widest uppercase">
                    {product.colorway}
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-oswald)] text-2xl font-bold text-[#F5F0E8] mb-1">
                  {product.name}
                </h2>
                <p className="text-[#D4A017] text-xs tracking-widest uppercase mb-3">
                  {product.subtitle}
                </p>
                <p className="text-[#888888] text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
                <a
                  href="https://instagram.com/lethweiofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-6 py-3 transition-colors inline-block w-full text-center"
                >
                  DM to Order
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-[#2A2A2A] bg-[#111111] mt-px p-8 text-center">
          <p className="text-[#555555] text-sm mb-2">
            Online ordering via Printful coming soon.
          </p>
          <p className="text-[#888888] text-sm">
            For now — DM{" "}
            <a
              href="https://instagram.com/lethweiofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4A017] hover:text-[#F0C040] transition-colors"
            >
              @lethweiofficial
            </a>{" "}
            or pick up our tees at <span className="text-[#F5F0E8]">Santa Monica Striking</span>.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold mb-4">
            WHILE YOU&apos;RE HERE
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <Link href="/learn" className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017] text-[#888888] px-8 py-4 transition-colors">
              Learn the Art of 9 Limbs
            </Link>
            <Link href="/forum" className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors">
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
