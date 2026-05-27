"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/learn", label: "What is Lethwei" },
  { href: "/gyms", label: "Find a Gym" },
  { href: "/shop", label: "Shop" },
  { href: "/forum", label: "Forum" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[var(--red)] flex items-center justify-center font-[family-name:var(--font-oswald)] font-bold text-white text-sm tracking-wider">
            L
          </div>
          <span className="font-[family-name:var(--font-oswald)] font-700 text-xl tracking-[0.12em] uppercase text-[var(--text)] group-hover:text-[var(--gold)] transition-colors">
            Lethwei
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/forum/new"
            className="font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase bg-[var(--red)] hover:bg-[var(--red-hover)] text-white px-4 py-2 transition-colors"
          >
            Join Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[var(--text-muted)] hover:text-[var(--text)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-oswald)] text-base tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/forum/new"
            onClick={() => setOpen(false)}
            className="font-[family-name:var(--font-oswald)] text-sm tracking-widest uppercase bg-[var(--red)] text-white px-4 py-2 text-center"
          >
            Join Now
          </Link>
        </div>
      )}
    </nav>
  );
}
