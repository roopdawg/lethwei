import Link from "next/link";
import { ProductGallery } from "@/components/ProductGallery";
import EmailSignupSection from "@/components/EmailSignupSection";
import { getProducts } from "@/lib/shopify";

/**
 * Shown until products are published to the Headless channel. Only items we
 * have real photography for — the live Shopify catalogue takes over the
 * moment it returns anything, so this never needs to stay in sync with it.
 */
const fallbackPieces = [
  {
    name: "Skull Tee",
    descriptor: "Acid wash / Skull artwork",
    views: [
      { src: "/skull-tee-front.jpg", label: "Front" },
      { src: "/skull-tee-back.jpg", label: "Back" },
    ],
  },
  {
    name: "9 Skull Hoodie",
    descriptor: "Acid wash / Nine skull artwork",
    views: [
      { src: "/skull-hoodie-front.webp", label: "Front" },
      { src: "/skull-hoodie-back.webp", label: "Back" },
    ],
  },
  {
    name: "Weapons Tee",
    descriptor: "Light blue / Sleeve print",
    views: [
      { src: "/weapons-tee-blue-front.webp", label: "Front" },
      { src: "/weapons-tee-blue.png", label: "Back" },
    ],
  },
  {
    name: "9 Skull Cap",
    descriptor: "Tonal skull emblem / Black",
    views: [
      { src: "/hat-skull-black-front.webp", label: "Front" },
      { src: "/hat-skull-black-side.webp", label: "Side" },
    ],
  },
  {
    name: "Script Cap",
    descriptor: "Embroidered script / Pink",
    views: [
      { src: "/hat-script-pink-front.webp", label: "Front" },
      { src: "/hat-script-pink-side.webp", label: "Side" },
    ],
  },
];

const limbs = ["2 Fists", "2 Elbows", "2 Knees", "2 Shins", "1 Head"];

const EYEBROW =
  "font-[family-name:var(--font-oswald)] text-[var(--gold)] text-sm tracking-[0.3em] uppercase";

export default async function Home() {
  const live = await getProducts();
  const pieces = live.length
    ? live.map((p) => ({
        name: p.name,
        // First sentence of the Shopify description, capped — these can run
        // to several paragraphs of blank-garment spec copy.
        descriptor: (p.description.split(".")[0] || "").slice(0, 60),
        views: p.views,
        price: p.price,
      }))
    : fallbackPieces.map((p) => ({ ...p, price: undefined as string | undefined }));

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ──
          mt-16 clears the fixed h-16 navbar in the root layout. */}
      <div className="bg-[var(--gold)] text-black mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center">
          <span className="font-[family-name:var(--font-oswald)] text-xs sm:text-sm tracking-[0.25em] uppercase">
            ● Drop 01 / Coming Soon
          </span>
          <Link
            href="/shop"
            className="font-[family-name:var(--font-oswald)] text-xs sm:text-sm tracking-[0.15em] uppercase underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Explore the collection ↗
          </Link>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="bg-[var(--bg)] px-6 sm:px-12 lg:px-16 py-20 md:py-28 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-10 h-px bg-[var(--gold)]" />
            <span className={EYEBROW}>LETHWEI® / The First Collection</span>
          </div>

          <h1 className="font-[family-name:var(--font-oswald)] font-bold text-7xl sm:text-8xl lg:text-9xl leading-[0.85] tracking-tight text-[var(--text)]">
            Drop 01<span className="text-[var(--red)]">.</span>
          </h1>

          <p className="font-[family-name:var(--font-oswald)] text-xl sm:text-2xl tracking-[0.15em] uppercase text-[var(--text)] mt-8">
            Nine limbs. First drop.
          </p>

          <p className="text-[var(--text-muted)] leading-relaxed mt-6 max-w-md">
            A first collection inspired by Myanmar&apos;s national martial art. Tees, a hoodie and
            caps. Every design by Gabe Schnider.
          </p>

          <div className="mt-10">
            <Link
              href="/shop"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-base bg-[var(--red)] hover:bg-[var(--red-hover)] text-white px-10 py-4 transition-colors inline-flex items-center gap-3"
            >
              Explore Drop 01 <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <p className="text-[var(--text-dim)] text-xs tracking-[0.2em] uppercase mt-8">
            Designed by{" "}
            <span className="text-[var(--text-muted)]">Gabe Schnider</span>
          </p>
        </div>

        <div className="relative bg-white min-h-[480px] md:min-h-0 flex items-center justify-center p-10">
          <span className="absolute top-6 left-6 font-[family-name:var(--font-oswald)] text-xs tracking-[0.25em] uppercase text-black/50">
            01 / The Skull Tee
          </span>
          <img
            src="/skull-tee-front.jpg"
            alt="LETHWEI® Skull Tee — Drop 01"
            className="max-h-[560px] w-auto object-contain"
          />
          <span className="absolute bottom-6 left-6 font-[family-name:var(--font-oswald)] text-xs tracking-[0.25em] uppercase text-black/70">
            Skull Tee
          </span>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-2 text-center">
          <span className="font-[family-name:var(--font-oswald)] text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">
            Rooted in Myanmar
          </span>
          <span className="text-[var(--gold)]" aria-hidden="true">✳</span>
          <span className="font-[family-name:var(--font-oswald)] text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">
            Designed by Gabe Schnider
          </span>
          <span className="text-[var(--gold)]" aria-hidden="true">✳</span>
          <span className="font-[family-name:var(--font-oswald)] text-xs tracking-[0.25em] uppercase text-[var(--text-muted)]">
            LETHWEI® / Drop 01
          </span>
        </div>
      </div>

      {/* ── THE COLLECTION ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="md:flex md:items-end md:justify-between gap-12 mb-12">
          <div>
            <span className={`${EYEBROW} mb-4 block`}>The Collection / Drop 01</span>
            <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none text-[var(--text)]">
              Choose your piece<span className="text-[var(--red)]">.</span>
            </h2>
          </div>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-sm mt-6 md:mt-0">
            {pieces.length} designs. One first collection. Explore the artwork and find your piece.
          </p>
        </div>

        <div className="border-t border-[var(--border)] pt-10">
          {/* Hairlines come from each cell's own border rather than a parent
              background showing through gaps — otherwise a half-filled last
              row renders as a solid grey block. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pieces.map((piece, i) => {
              return (
              <div
                key={piece.name}
                className="bg-[var(--bg)] group border-b border-[var(--border)] sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
              >
                <div className="relative aspect-[4/5] bg-white overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 font-[family-name:var(--font-oswald)] text-xs tracking-[0.2em] text-black/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ProductGallery views={piece.views} name={piece.name} showLabels={false} />
                </div>
                <div className="py-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-[family-name:var(--font-oswald)] text-lg tracking-[0.1em] uppercase text-[var(--text)]">
                      {piece.name}
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm mt-1">{piece.descriptor}</p>
                  </div>
                  {piece.price && (
                    <span className="font-[family-name:var(--font-oswald)] text-sm tracking-widest text-[var(--gold)] whitespace-nowrap mt-1">
                      {piece.price}
                    </span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/shop"
            className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[var(--red)] hover:bg-[var(--red-hover)] text-white px-10 py-4 transition-colors inline-flex items-center gap-3"
          >
            Shop the Drop <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* ── THE ART BEHIND THE COLLECTION ── */}
      <section className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center">
            <div className="font-[family-name:var(--font-oswald)] font-bold text-[var(--red)] text-[14rem] md:text-[18rem] leading-none select-none">
              9
            </div>
            <span className={`${EYEBROW} tracking-[0.5em]`}>LETHWEI</span>
          </div>

          <div>
            <span className={`${EYEBROW} mb-4 block`}>The Art Behind the Collection</span>
            <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none">
              <span className="text-[var(--text)]">Myanmar&apos;s art.</span>
              <br />
              <span className="text-[var(--text-muted)]">Nine limbs.</span>
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mt-6 max-w-lg">
              LETHWEI® bare knuckle is Myanmar&apos;s national martial art. The art of nine limbs
              brings fists, elbows, knees, shins and the head into one striking tradition. That
              heritage inspires this first collection.
            </p>

            <div className="flex flex-wrap gap-2 mt-8">
              {limbs.map((l) => (
                <span
                  key={l}
                  className="font-[family-name:var(--font-oswald)] text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] border border-[var(--border)] px-4 py-2"
                >
                  {l}
                </span>
              ))}
            </div>

            <Link
              href="/learn"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase text-[var(--text)] border-b border-[var(--gold)] pb-1 mt-10 hover:text-[var(--gold)] transition-colors group"
            >
              Learn about LETHWEI®
              <span className="group-hover:translate-x-1 transition-transform inline-block" aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE PEOPLE BEHIND THE DROP ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <span className={`${EYEBROW} mb-4 block`}>The People Behind the Drop</span>
            <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none text-[var(--text)]">
              Real people.
              <br />
              Shared respect.
            </h2>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[var(--text-muted)] leading-relaxed">
              Dean Perry Rosenwald is the coach and creator behind this brand. Gabe Schnider designed
              every piece in Drop 01. Discover the people, the training and the art behind the
              collection.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8">
              {[
                { href: "/learn", label: "Meet Dean" },
                { href: "/gyms", label: "Find a place to train" },
                { href: "/forum", label: "Join the community" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-2 font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase text-[var(--text)] border-b border-[var(--border)] pb-1 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors group"
                >
                  {l.label}
                  <span className="group-hover:translate-x-1 transition-transform inline-block" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EmailSignupSection />
    </>
  );
}
