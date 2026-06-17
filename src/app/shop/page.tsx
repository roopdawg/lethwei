import Link from "next/link";

export const metadata = {
  title: "Shop — Lethwei Gear | T-Shirts, Hoodies & Hats",
  description: "Represent Lethwei. Shop official t-shirts, hoodies, and hats.",
};

const products = [
  {
    id: "skull-tee",
    name: "Skull Tee",
    subtitle: "The Art of Nine Limbs",
    description: "Acid wash heavyweight tee. Anatomical skull on the front, 'the art of nine limbs' in gothic script across the back. The flagship design.",
    colorway: "Acid Wash Black",
    frontImage: "/skull-tee-front.jpg",
    backImage: "/skull-tee-back.jpg",
    tag: "Drop 01",
  },
  {
    id: "weapons-tee-black",
    name: "Weapons Tee",
    subtitle: "Knee. Elbow. Knuckle. Shin. Skull.",
    description: "Five weapons. One back. Stacked in bold caps on a clean black tee. Lethwei branded on the sleeve. No front graphic — just the list.",
    colorway: "Black",
    frontImage: "/weapons-tee-black.png",
    backImage: "/weapons-tee-black.png",
    tag: "Drop 01",
  },
  {
    id: "weapons-tee-blue",
    name: "Weapons Tee",
    subtitle: "Knee. Elbow. Knuckle. Shin. Skull.",
    description: "Same clean weapons stack, washed-out white on powder blue. The contrast colorway for when you want to run it light.",
    colorway: "Light Blue",
    frontImage: "/weapons-tee-blue.png",
    backImage: "/weapons-tee-blue.png",
    tag: "Drop 01",
  },
];

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#110000] to-[#0A0A0A]" />
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
        <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]">
          {products.map((product) => (
            <div key={product.id} className="bg-[#111111] group">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-[#0A0A0A]">
                <img
                  src={product.frontImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0 absolute inset-0"
                />
                <img
                  src={product.backImage}
                  alt={`${product.name} — back`}
                  className="w-full h-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100 absolute inset-0"
                />
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
            or pick one up at <span className="text-[#F5F0E8]">Santa Monica Striking</span>.
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
              Learn Lethwei
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
