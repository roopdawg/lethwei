import Link from "next/link";

export const metadata = {
  title: "Trademark Policy — LETHWEI™",
  description: "How the LETHWEI™ mark may and may not be used. Permitted uses, prohibited uses, and how to request permission.",
};

const permitted = [
  "Referring to the sport of bare knuckle martial arts by its ordinary name, in lowercase, in ordinary descriptive text.",
  "Truthfully stating that your gym teaches, or that you compete in, bare knuckle martial arts.",
  "Editorial, journalistic, and historical writing about the sport, its fighters, and its history.",
  "Linking to this website.",
];

const prohibited = [
  "Using LETHWEI™ as the name of your own goods — apparel, headwear, or any other merchandise.",
  "Using LETHWEI™ in a business name, domain name, social media handle, or logo in a way that suggests you are us, or that we endorse, sponsor, or are affiliated with you.",
  "Applying the mark to a tag, label, or any other source-identifying part of a product you sell.",
  "Altering the mark — no abbreviations, no combining it with other words to form a new mark, no redrawing the logo.",
];

const usage = [
  {
    rule: "Always an adjective, never a noun",
    right: "LETHWEI™ martial arts · LETHWEI™ gear · LETHWEI™ gyms",
    wrong: "Discover Lethwei · Train Lethwei · Lethwei is a sport",
  },
  {
    rule: "Never plural, never possessive",
    right: "LETHWEI™ techniques · the rules of LETHWEI™ martial arts",
    wrong: "Lethweis · Lethwei's rules",
  },
  {
    rule: "Always with the ™ symbol on first use",
    right: "LETHWEI™ bare knuckle",
    wrong: "lethwei bare knuckle",
  },
];

export default function TrademarkPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#110000] to-[#0A0A0A]" />
        <img
          src="/emblem.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[4%] top-1/2 -translate-y-1/2 h-[125%] w-auto max-w-none opacity-25 hidden lg:block"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Legal
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] text-5xl md:text-7xl font-bold leading-none mb-6">
            TRADEMARK<br />
            <span className="text-[#C41E1E]">POLICY</span>
          </h1>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
          <p className="text-[#888888] text-lg leading-relaxed">
            LETHWEI™ is a trademark. This page explains how the mark may and may not be used,
            so that everyone gets fair and reasonable notice of where the line sits.
          </p>
        </div>
      </section>

      {/* The distinction */}
      <section className="py-16 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold mb-6">
            THE SPORT AND <span className="text-[#C41E1E]">THE BRAND</span>
          </h2>
          <p className="text-[#888888] leading-relaxed mb-4">
            Bare knuckle martial arts — the art of 9 limbs — is an ancient sport with roots in
            12th-century Burma. Nobody owns the sport, and nobody owns the ordinary, descriptive
            use of its name.
          </p>
          <p className="text-[#888888] leading-relaxed">
            LETHWEI™ is different. It is a brand: a source identifier that tells you goods and
            services come from us and not from someone else. This policy is about the brand.
          </p>
        </div>
      </section>

      {/* Usage rules */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
          How to write it
        </span>
        <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold mb-8">
          USING THE MARK <span className="text-[#C41E1E]">CORRECTLY</span>
        </h2>

        <div className="space-y-px bg-[#2A2A2A] border border-[#2A2A2A]">
          {usage.map((u) => (
            <div key={u.rule} className="bg-[#111111] p-6">
              <h3 className="font-[family-name:var(--font-oswald)] text-xl uppercase tracking-wide text-[#F5F0E8] mb-4">
                {u.rule}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[#555555] text-xs tracking-widest uppercase mb-2">Correct</p>
                  <p className="text-[#D4A017] text-sm leading-relaxed">{u.right}</p>
                </div>
                <div>
                  <p className="text-[#555555] text-xs tracking-widest uppercase mb-2">Incorrect</p>
                  <p className="text-[#888888] text-sm leading-relaxed line-through decoration-[#C41E1E]/60">
                    {u.wrong}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Permitted / prohibited */}
      <section className="py-16 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8">
          <div className="border border-[#2A2A2A] bg-[#0A0A0A] p-8">
            <h3 className="font-[family-name:var(--font-oswald)] text-2xl text-[#D4A017] mb-6">
              You may
            </h3>
            <ul className="space-y-3 text-[#888888] text-sm">
              {permitted.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="text-[#D4A017] mt-0.5">▶</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#2A2A2A] bg-[#0A0A0A] p-8">
            <h3 className="font-[family-name:var(--font-oswald)] text-2xl text-[#C41E1E] mb-6">
              You may not
            </h3>
            <ul className="space-y-3 text-[#888888] text-sm">
              {prohibited.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="text-[#C41E1E] mt-0.5">▶</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Official goods */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold mb-6">
          OFFICIAL <span className="text-[#C41E1E]">GEAR</span>
        </h2>
        <p className="text-[#888888] leading-relaxed mb-6">
          Official LETHWEI™ apparel carries the LETHWEI™ label. If a garment does not carry
          that label, it did not come from us — whatever the print on the front says.
        </p>
        <Link
          href="/shop"
          className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors inline-block"
        >
          Shop Official Gear
        </Link>
      </section>

      {/* Permission */}
      <section className="py-16 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold mb-4">
            NEED <span className="text-[#D4A017]">PERMISSION?</span>
          </h2>
          <p className="text-[#888888] text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            If you want to use the LETHWEI™ mark in a way this policy does not permit — on
            merchandise, in an event name, in a business name — ask first. Most reasonable
            requests are granted.
          </p>
          <a
            href="https://instagram.com/lethweiofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-black px-8 py-4 transition-colors inline-block"
          >
            Contact @lethweiofficial
          </a>
        </div>
      </section>
    </>
  );
}
