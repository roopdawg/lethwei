import Link from "next/link";

const nineWeapons = [
  { number: "01", name: "Punches", burmese: "Let Thee", description: "Jabs, crosses, hooks, uppercuts, spinning backfists — the fists are honed for maximum damage and blood." },
  { number: "02", name: "Elbows", burmese: "Tel Daung", description: "Horizontal, upward, flying, and spinning elbows. Devastating at close range — bones break." },
  { number: "03", name: "Knees", burmese: "Doo", description: "Straight, spear, jumping, and double flying knees. The engine of the brutal clinch game." },
  { number: "04", name: "Kicks", burmese: "Kan", description: "Roundhouses, hook kicks, axe kicks, spinning back kicks. Full-power leg strikes with no mercy." },
  { number: "05", name: "Headbutts", burmese: "Gowl Tite", description: "The weapon that sets the art of 9 limbs apart from every other striking discipline. The ninth limb — and the most feared." },
];

const stats = [
  { value: "2,000+", label: "Years of History" },
  { value: "9", label: "Weapons in the Arsenal" },
  { value: "KO Only", label: "Traditional Victory" },
  { value: "Bare Knuckle", label: "No Gloves. No Mercy." },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#110000] to-[#0A0A0A]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C41E1E]/10 rounded-full blur-[120px] pointer-events-none" />
        {/* No ghost backdrop here: unlike the other heroes this one is centred,
            so there is no empty half for it to occupy without fighting the type. */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-[#D4A017]" />
            <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase">
              The Fastest Growing Martial Art in History
            </span>
            <span className="w-8 h-px bg-[#D4A017]" />
          </div>

          <h1 className="font-[family-name:var(--font-oswald)] font-bold text-7xl sm:text-8xl md:text-9xl tracking-tight leading-none mb-6">
            <span className="text-[#F5F0E8]">THE</span>
            <br />
            <span className="text-[#C41E1E]">ART OF</span>
            <br />
            <span className="text-[#D4A017]">9 LIMBS</span>
          </h1>

          <p className="text-[#888888] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Myanmar&apos;s ancient bareknuckle art. Two warriors. No gloves. One falls.
            LETHWEI™ bare knuckle — the most brutal and beautiful combat sport on earth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-base bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors w-full sm:w-auto text-center"
            >
              Discover the Art of 9 Limbs
            </Link>
            <Link
              href="/shop"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-base bg-[#D4A017] hover:bg-[#F0C040] text-black px-8 py-4 transition-colors w-full sm:w-auto text-center"
            >
              Shop Now
            </Link>
            <Link
              href="/forum"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-base border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017] text-[#888888] px-8 py-4 transition-colors w-full sm:w-auto text-center"
            >
              Join the Community
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-[#2A2A2A] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#2A2A2A]">
            {stats.map((s) => (
              <div key={s.label} className="py-10 px-6 text-center">
                <div className="font-[family-name:var(--font-oswald)] text-3xl md:text-4xl font-bold text-[#D4A017] mb-1">
                  {s.value}
                </div>
                <div className="text-[#888888] text-xs tracking-widest uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GEAR ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/5] bg-[#111111] border border-[#2A2A2A] relative overflow-hidden">
              <img
                src="/skull-tee-front.jpg"
                alt="LETHWEI™ Skull Tee — Drop 01"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-xs tracking-[0.3em] uppercase">
                  Available Now
                </span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-[#C41E1E]" />
            <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-[#C41E1E]" />
          </div>

          <div className="order-1 md:order-2">
            <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
              Official Gear
            </span>
            <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none mb-6">
              WEAR THE<br />
              <span className="text-[#C41E1E]">FEDERATION</span>
            </h2>
            <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
            <p className="text-[#888888] leading-relaxed mb-4">
              Acid wash heavyweight tee. Anatomical skull on the front, &ldquo;the art of nine limbs&rdquo; in gothic script across the back. Designed by Gabe Schnider — simple, dark, and built for people who know the art of 9 limbs.
            </p>
            <p className="text-[#888888] leading-relaxed mb-8">
              Also available: the Weapons Tee — KNEE / ELBOW / KNUCKLE / SHIN / SKULL stacked across the back in black and light blue. Three colorways, one drop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors text-center"
              >
                Shop Now
              </Link>
              <Link
                href="/shop"
                className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017] text-[#888888] px-8 py-4 transition-colors text-center"
              >
                View All Gear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS LETHWEI ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
              The Origin
            </span>
            <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none mb-6">
              FORGED IN<br />
              <span className="text-[#C41E1E]">MYANMAR</span>
            </h2>
            <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
            <p className="text-[#888888] leading-relaxed mb-4">
              The art of 9 limbs traces its roots to the 12th-century Pagan Kingdom of Burma — over 2,000 years of warrior tradition. Ancient matches were held in sand pits, fought without protective gear, continuing until one man could not stand.
            </p>
            <p className="text-[#888888] leading-relaxed mb-8">
              Unlike any other striking art, it permits headbutts, making it the most complete and devastating standing combat system ever developed. In traditional rules, only a knockout wins. A draw is a warrior&apos;s fate.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase text-[#D4A017] hover:text-[#F0C040] transition-colors group"
            >
              Learn the full history
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-[#111111] border border-[#2A2A2A] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C41E1E]/20 to-transparent" />
              <img
                src="/emblem.webp"
                alt="Nine weapons radiating from a single core — the art of 9 limbs"
                className="emblem-spin absolute inset-0 w-full h-full object-contain p-5"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/75 to-transparent">
                <div className="font-[family-name:var(--font-oswald)] text-xl tracking-widest uppercase text-[#F5F0E8]">
                  9 Weapons. <span className="text-[#C41E1E]">One Warrior.</span>
                </div>
                <div className="mt-1 text-sm text-[#D4A017]">
                  Fists · Elbows · Knees · Kicks · <span className="text-[#F0C040]">Headbutts</span>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-[#D4A017]" />
            <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-[#D4A017]" />
          </div>
        </div>
      </section>

      {/* ── THE 9 LIMBS ── */}
      <section className="py-24 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
              The Arsenal
            </span>
            <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none">
              THE <span className="text-[#C41E1E]">9 WEAPONS</span>
            </h2>
            <span className="block w-16 h-[3px] bg-[#D4A017] mt-4 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2A2A2A]">
            {nineWeapons.map((w) => (
              <div key={w.number} className="bg-[#111111] p-8 hover:bg-[#1A1A1A] transition-colors group">
                <div className="font-[family-name:var(--font-oswald)] text-5xl font-bold text-[#C41E1E]/20 group-hover:text-[#C41E1E]/40 transition-colors mb-4">
                  {w.number}
                </div>
                <h3 className="font-[family-name:var(--font-oswald)] text-xl tracking-wide uppercase text-[#F5F0E8] mb-1">
                  {w.name}
                </h3>
                <p className="text-[#D4A017] text-xs tracking-widest uppercase mb-3">{w.burmese}</p>
                <p className="text-[#888888] text-sm leading-relaxed">{w.description}</p>
              </div>
            ))}
            <div className="bg-[#C41E1E]/10 border border-[#C41E1E]/30 p-8 hover:bg-[#C41E1E]/20 transition-colors">
              <div className="font-[family-name:var(--font-oswald)] text-5xl font-bold text-[#C41E1E]/40 mb-4">☠</div>
              <h3 className="font-[family-name:var(--font-oswald)] text-xl tracking-wide uppercase text-[#C41E1E] mb-1">
                What Sets It Apart
              </h3>
              <p className="text-[#D4A017] text-xs tracking-widest uppercase mb-3">No other art allows this</p>
              <p className="text-[#888888] text-sm leading-relaxed">
                Every other striking art bans the headbutt. The art of 9 limbs doesn&apos;t. That single rule changes everything about how you fight, defend, and survive.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/learn#techniques"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017] text-[#888888] px-8 py-4 transition-colors inline-block"
            >
              See All Techniques
            </Link>
          </div>
        </div>
      </section>

      {/* ── DESIGN DROPS ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Now Available
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-5xl md:text-6xl font-bold leading-none">
            DROP <span className="text-[#C41E1E]">01</span>
          </h2>
          <span className="block w-16 h-[3px] bg-[#D4A017] mt-4 mx-auto" />
          <p className="text-[#888888] mt-6 max-w-xl mx-auto text-sm leading-relaxed">
            Designed by Gabe Schnider. Hover to see the back. DM{" "}
            <a href="https://instagram.com/lethweiofficial" className="text-[#D4A017] hover:text-[#F0C040] transition-colors">@lethweiofficial</a>{" "}
            to order — online shop coming soon.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]">
          {[
            {
              name: "LETHWEI™ Skull Tee",
              colorway: "Acid Wash Black",
              views: [
                { src: "/skull-tee-front.jpg", label: "Front" },
                { src: "/skull-tee-back.jpg", label: "Back" },
              ],
              tag: "Drop 01",
            },
            {
              name: "LETHWEI™ Weapons Tee",
              colorway: "Light Blue",
              views: [
                { src: "/weapons-tee-blue-front.webp", label: "Front" },
                { src: "/weapons-tee-blue.png", label: "Back" },
              ],
              tag: "Drop 01",
            },
            {
              // Back only — no front photograph of the BLACK colourway yet.
              name: "LETHWEI™ 9 Skull Hoodie",
              colorway: "Acid Wash Black",
              views: [
                { src: "/skull-hoodie-front.webp", label: "Front" },
                { src: "/skull-hoodie-back.webp", label: "Back" },
              ],
              tag: "Drop 01",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#111111] group relative overflow-hidden">
              <div className="aspect-square relative bg-[#0A0A0A]">
                <img
                  src={item.views[0].src}
                  alt={`${item.name} — ${item.views[0].label.toLowerCase()}`}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                    item.views.length > 1 ? "group-hover:opacity-0" : ""
                  }`}
                />
                {item.views[1] && (
                  <img
                    src={item.views[1].src}
                    alt={`${item.name} — ${item.views[1].label.toLowerCase()}`}
                    className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 block transition-opacity duration-500 ${
                      item.views.length > 1 ? "group-hover:opacity-0" : ""
                    }`}
                  >
                    {item.views[0].label}
                  </span>
                  {item.views[1] && (
                    <span className="font-[family-name:var(--font-oswald)] text-xs tracking-widest uppercase bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {item.views[1].label}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 border-t border-[#2A2A2A]">
                <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-xs tracking-[0.3em] uppercase">
                  {item.tag}
                </span>
                <h3 className="font-[family-name:var(--font-oswald)] text-xl tracking-wide uppercase text-[#F5F0E8] mt-1">
                  {item.name}
                </h3>
                <p className="text-[#555555] text-xs tracking-widest uppercase mt-0.5">
                  {item.colorway}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-10 py-4 transition-colors inline-block"
          >
            Shop All Gear
          </Link>
        </div>
      </section>

      {/* ── COMMUNITY + SHOP CTA ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-[#2A2A2A] bg-[#111111] p-10 relative overflow-hidden group hover:border-[#D4A017] transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/5 rounded-full blur-2xl group-hover:bg-[#D4A017]/10 transition-colors" />
            <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-xs tracking-[0.3em] uppercase mb-4 block">
              Community
            </span>
            <h3 className="font-[family-name:var(--font-oswald)] text-4xl font-bold mb-4">
              JOIN THE<br />WARRIORS
            </h3>
            <p className="text-[#888888] text-sm leading-relaxed mb-8">
              Train talk. Technique breakdowns. Event discussions. Find training partners.
              The LETHWEI™ community is here.
            </p>
            <Link
              href="/forum"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#D4A017] hover:bg-[#F0C040] text-black px-8 py-3 transition-colors inline-block"
            >
              Enter the Forum
            </Link>
          </div>

          <div className="border border-[#2A2A2A] bg-[#111111] p-10 relative overflow-hidden group hover:border-[#C41E1E] transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C41E1E]/5 rounded-full blur-2xl group-hover:bg-[#C41E1E]/10 transition-colors" />
            <span className="font-[family-name:var(--font-oswald)] text-[#C41E1E] text-xs tracking-[0.3em] uppercase mb-4 block">
              Represent
            </span>
            <h3 className="font-[family-name:var(--font-oswald)] text-4xl font-bold mb-4">
              WEAR THE<br />TRADITION
            </h3>
            <p className="text-[#888888] text-sm leading-relaxed mb-8">
              T-shirts, hoodies, and hats. Carry the warrior spirit wherever you go.
              LETHWEI™ gear built for those who know.
            </p>
            <Link
              href="/shop"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-3 transition-colors inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── GYM CTA ── */}
      <section className="py-16 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-5xl font-bold mb-4">
            FIND A GYM.<br />
            <span className="text-[#C41E1E]">START TRAINING.</span>
          </h2>
          <p className="text-[#888888] max-w-xl mx-auto mb-8">
            Bare knuckle is growing across the United States. Find a gym near you or list your own.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gyms"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors w-full sm:w-auto text-center"
            >
              Find a Gym
            </Link>
            <Link
              href="/gyms/submit"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#888888] text-[#888888] hover:text-[#F5F0E8] px-8 py-4 transition-colors w-full sm:w-auto text-center"
            >
              List Your Gym
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
