import Link from "next/link";

export const metadata = {
  title: "Page Not Found — LETHWEI®",
};

const links = [
  { href: "/learn", label: "The Art of 9 Limbs" },
  { href: "/gyms", label: "Find a Gym" },
  { href: "/shop", label: "Shop" },
  { href: "/forum", label: "Forum" },
];

export default function NotFound() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#110000] to-[#0A0A0A]" />
      <img
        src="/emblem.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-[-6%] top-1/2 -translate-y-1/2 h-[125%] w-auto max-w-none opacity-40 hidden lg:block"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
          404 — No Contest
        </span>
        <h1 className="font-[family-name:var(--font-oswald)] text-6xl md:text-8xl font-bold leading-none mb-6">
          THIS PAGE<br />
          <span className="text-[#C41E1E]">DIDN&apos;T MAKE WEIGHT</span>
        </h1>
        <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
        <p className="text-[#888888] text-lg max-w-xl leading-relaxed mb-10">
          The page you were looking for isn&apos;t here. Try one of these instead.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors"
          >
            Back Home
          </Link>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#D4A017] hover:text-[#D4A017] text-[#888888] px-8 py-4 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
