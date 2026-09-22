import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Find a LETHWEI™ Gym Near You | Gym Directory",
  description: "Find LETHWEI™ gyms across the United States. Train bareknuckle. Learn the Art of 9 Limbs.",
};

export default async function GymsPage() {
  const gyms = await prisma.gym.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001100] to-[#0A0A0A]" />
        <img
          src="/ghost-gyms.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-[-8%] top-1/2 -translate-y-1/2 h-[130%] w-auto max-w-none opacity-60 hidden lg:block"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Training Network
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] text-6xl md:text-8xl font-bold leading-none mb-6">
            FIND A<br />
            <span className="text-[#C41E1E]">GYM</span>
          </h1>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
          <p className="text-[#888888] text-lg max-w-2xl leading-relaxed">
            LETHWEI™ gyms across the United States. Find where to train, compete, and connect with other warriors.
          </p>
          <div className="mt-8">
            <Link
              href="/gyms/submit"
              className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#D4A017] text-[#D4A017] hover:bg-[#D4A017] hover:text-black px-6 py-3 transition-colors inline-block"
            >
              + List Your Gym
            </Link>
          </div>
        </div>
      </section>

      {/* Legal note */}
      <section className="bg-[#111111] border-y border-[#2A2A2A] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-[#555555] text-xs text-center">
            ⚠ Note: Bare knuckle is legally sanctioned in Wyoming, and select other US states. Always verify local regulations before training or competing.
          </p>
        </div>
      </section>

      {/* Gym list */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {gyms.length === 0 ? (
          <div className="border border-[#2A2A2A] bg-[#111111] p-16 text-center">
            <div className="font-[family-name:var(--font-oswald)] text-5xl text-[#2A2A2A] mb-4">🥊</div>
            <h3 className="font-[family-name:var(--font-oswald)] text-2xl text-[#555555] mb-2">No Gyms Listed Yet</h3>
            <p className="text-[#555555] text-sm mb-6">Be the first to list your LETHWEI™ gym.</p>
            <Link href="/gyms/submit" className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-3 transition-colors inline-block">
              List Your Gym
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <div key={gym.id} className="border border-[#2A2A2A] bg-[#111111] p-6 hover:border-[#C41E1E] transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-[family-name:var(--font-oswald)] text-xl uppercase text-[#F5F0E8]">{gym.name}</h3>
                    <p className="text-[#888888] text-sm">{gym.city}, {gym.state}</p>
                  </div>
                  <span className="text-xs bg-[#C41E1E]/20 text-[#C41E1E] px-2 py-1 font-[family-name:var(--font-oswald)] tracking-widest uppercase">
                    Gym
                  </span>
                </div>
                {gym.description && (
                  <p className="text-[#888888] text-sm leading-relaxed mb-4">{gym.description}</p>
                )}
                {gym.website && (
                  <a
                    href={gym.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4A017] text-xs tracking-widest uppercase hover:text-[#F0C040] transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit CTA */}
      <section className="py-16 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-3xl font-bold mb-4">
            TEACH LETHWEI™ MARTIAL ARTS?<br />
            <span className="text-[#D4A017]">GET LISTED.</span>
          </h2>
          <p className="text-[#888888] mb-8 max-w-md mx-auto text-sm">
            If your gym offers LETHWEI™ training, get listed here and connect with the growing US community.
          </p>
          <Link
            href="/gyms/submit"
            className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#D4A017] hover:bg-[#F0C040] text-black px-8 py-4 transition-colors inline-block"
          >
            Submit Your Gym
          </Link>
        </div>
      </section>
    </>
  );
}
