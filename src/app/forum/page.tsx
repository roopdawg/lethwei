import Link from "next/link";

export const metadata = {
  title: "Forum — Lethwei Community | Training, Technique & Events",
  description: "The Lethwei community forum. Discuss training, technique, events, and connect with warriors worldwide.",
};

const categories = [
  {
    slug: "training",
    name: "Training",
    icon: "🥊",
    description: "Conditioning, sparring, drills, and training methodology.",
    color: "#C41E1E",
  },
  {
    slug: "technique",
    name: "Technique",
    icon: "🧠",
    description: "Headbutt entries, elbow combos, clinch work, and the 9 limbs breakdown.",
    color: "#D4A017",
  },
  {
    slug: "events",
    name: "Events & Fights",
    icon: "🏆",
    description: "WLC cards, local events, fight results, and fight analysis.",
    color: "#C41E1E",
  },
  {
    slug: "general",
    name: "General Discussion",
    icon: "💬",
    description: "Anything Lethwei. Culture, history, gear, and community.",
    color: "#D4A017",
  },
  {
    slug: "find-training",
    name: "Find Training Partners",
    icon: "🤝",
    description: "Looking for sparring partners, coaches, or training camps near you.",
    color: "#C41E1E",
  },
  {
    slug: "beginners",
    name: "New to Lethwei",
    icon: "🌱",
    description: "Just discovered the Art of 9 Limbs? Start here.",
    color: "#D4A017",
  },
];

export default function ForumPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0011] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Community
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] text-6xl md:text-8xl font-bold leading-none mb-6">
            THE WARRIORS<br />
            <span className="text-[#C41E1E]">FORUM</span>
          </h1>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
          <p className="text-[#888888] text-lg max-w-2xl leading-relaxed">
            Talk training. Break down techniques. Discuss fights. Find sparring partners.
            This is the home of the Lethwei community.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/forum/new-thread"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-6 py-3 transition-colors inline-block"
            >
              + New Thread
            </Link>
            <Link
              href="/auth/signin"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#888888] text-[#888888] hover:text-[#F5F0E8] px-6 py-3 transition-colors inline-block"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-px bg-[#2A2A2A] border border-[#2A2A2A]">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/forum/${cat.slug}`}
              className="bg-[#111111] p-6 hover:bg-[#1A1A1A] transition-colors group flex gap-4 items-start"
            >
              <span className="text-3xl mt-0.5">{cat.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3
                    className="font-[family-name:var(--font-oswald)] text-xl uppercase tracking-wide group-hover:text-[#F5F0E8] transition-colors"
                    style={{ color: cat.color }}
                  >
                    {cat.name}
                  </h3>
                </div>
                <p className="text-[#888888] text-sm leading-relaxed">{cat.description}</p>
              </div>
              <span className="text-[#333333] group-hover:text-[#888888] transition-colors font-[family-name:var(--font-oswald)] text-xl mt-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="py-12 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="border border-[#D4A017]/30 bg-[#D4A017]/5 p-8 text-center">
            <h3 className="font-[family-name:var(--font-oswald)] text-2xl mb-2">
              JOIN THE CONVERSATION
            </h3>
            <p className="text-[#888888] text-sm mb-6">
              Create a free account to post threads, reply, and connect with the community.
            </p>
            <Link
              href="/auth/signin"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#D4A017] hover:bg-[#F0C040] text-black px-8 py-3 transition-colors inline-block"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
