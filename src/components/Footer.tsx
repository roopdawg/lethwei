import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[var(--red)] flex items-center justify-center font-[family-name:var(--font-oswald)] font-bold text-white text-sm">
                L
              </div>
              <span className="font-[family-name:var(--font-oswald)] font-bold text-xl tracking-[0.12em] uppercase">
                Lethwei
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs">
              The Art of 9 Limbs. The fastest growing combat sport in the world.
              Bare-knuckle. No mercy. Pure warrior tradition.
            </p>
            <span className="red-line mt-5 block" />
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase text-[var(--gold)] mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/learn", label: "What is Lethwei" },
                { href: "/learn#history", label: "History" },
                { href: "/learn#rules", label: "Rules" },
                { href: "/learn#techniques", label: "The 9 Limbs" },
                { href: "/gyms", label: "Find a Gym" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase text-[var(--gold)] mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/forum", label: "Forum" },
                { href: "/shop", label: "Shop" },
                { href: "/gyms/submit", label: "List Your Gym" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[var(--text-dim)] text-xs">
            © {new Date().getFullYear()} Lethwei. All rights reserved.
          </p>
          <p className="text-[var(--text-dim)] text-xs">
            The Art of 9 Limbs — Bare Knuckle. Warrior Spirit.
          </p>
        </div>
      </div>
    </footer>
  );
}
