import Link from "next/link";

export const metadata = {
  title: "What is Lethwei — The Art of 9 Limbs | History, Rules & Techniques",
  description: "Learn everything about Lethwei — Myanmar's ancient bareknuckle martial art. History, rules, the 9 weapons, and how it compares to Muay Thai.",
};

const timeline = [
  { year: "12th Century", event: "Origins in the Pagan Kingdom of Burma. Sand pit matches with no protective gear — knockout or die." },
  { year: "1900s", event: "British colonial suppression. The art goes underground, preserved by the Karen and Mon peoples." },
  { year: "1950s", event: "Kyar Ba Nyein revives the sport, travels Myanmar recruiting fighters and establishing modern standards." },
  { year: "1996", event: "Myanmar Traditional Lethwei Federation introduces tournament rules and the Golden Belt Championship." },
  { year: "2001", event: "First American fighters compete in Myanmar. International expansion begins." },
  { year: "2015", event: "ONE Championship hosts the first caged Lethwei match. The world takes notice." },
  { year: "2016", event: "Dave Leduc becomes the first non-Burmese Golden Belt Champion. Lethwei goes global." },
  { year: "2019", event: "World Lethwei Championship broadcasts on UFC Fight Pass. Mainstream breakthrough." },
];

const techniques = [
  {
    category: "Punches — Let Thee",
    color: "#C41E1E",
    items: ["Jab", "Cross", "Hook", "Uppercut", "Overhand", "Backfist", "Spinning Backfist", "Hammerfist", "Superman Punch"],
  },
  {
    category: "Elbows — Tel Daung",
    color: "#C41E1E",
    items: ["Horizontal Elbow", "Upward Elbow", "Downward Elbow", "Thrust Elbow", "Reverse Elbow", "Flying Elbow", "Spinning Elbow"],
  },
  {
    category: "Knees — Doo",
    color: "#D4A017",
    items: ["Straight Knee", "Spear Knee", "Side Knee", "Upward Knee", "Downward Knee", "Knee Slap", "Double Flying Knee", "Jumping Knee"],
  },
  {
    category: "Kicks — Kan",
    color: "#D4A017",
    items: ["Roundhouse Kick", "Spinning Back Kick", "Hook Kick", "Side Kick", "Axe Kick", "Flying Kick", "Step-Up Kick"],
  },
  {
    category: "Headbutts — Gowl Tite",
    color: "#C41E1E",
    items: ["Forward Headbutt", "Upward Headbutt", "Side Headbutt", "Clinch Headbutt", "Flying Headbutt", "Rushing Headbutt", "Downward Headbutt"],
  },
];

export default function LearnPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#110000] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Education
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] text-6xl md:text-8xl font-bold leading-none mb-6">
            WHAT IS<br />
            <span className="text-[#C41E1E]">LETHWEI?</span>
          </h1>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
          <p className="text-[#888888] text-lg max-w-2xl leading-relaxed">
            The most complete and brutal striking art ever developed. Over 2,000 years old.
            Bare knuckle. Headbutts allowed. Knockout-only victories in traditional rules.
          </p>
        </div>
      </section>

      {/* Quick comparison */}
      <section className="py-16 bg-[#111111] border-y border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]">
            {[
              { label: "Gloves", lethwei: "Bare Knuckle", muaythai: "16oz Gloves" },
              { label: "Head Weapons", lethwei: "✓ Headbutts Allowed", muaythai: "✗ Banned" },
              { label: "Victory", lethwei: "KO Only (traditional)", muaythai: "Points or KO" },
            ].map((row) => (
              <div key={row.label} className="bg-[#111111] p-6">
                <p className="text-[#555555] text-xs tracking-widest uppercase mb-3">{row.label}</p>
                <p className="font-[family-name:var(--font-oswald)] text-xl text-[#C41E1E] mb-1">Lethwei: {row.lethwei}</p>
                <p className="font-[family-name:var(--font-oswald)] text-xl text-[#555555]">Muay Thai: {row.muaythai}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section id="history" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
          Timeline
        </span>
        <h2 className="font-[family-name:var(--font-oswald)] text-5xl font-bold mb-12">
          2,000 YEARS OF <span className="text-[#C41E1E]">HISTORY</span>
        </h2>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#2A2A2A]" />
          <div className="space-y-12">
            {timeline.map((item, i) => (
              <div key={item.year} className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-start`}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 bg-[#C41E1E] rounded-full mt-1" />
                <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-widest uppercase">
                    {item.year}
                  </span>
                  <p className="text-[#888888] text-sm leading-relaxed mt-1">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="py-24 bg-[#111111] border-y border-[#2A2A2A] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            The Rules
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-5xl font-bold mb-12">
            HOW IT <span className="text-[#C41E1E]">WORKS</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-[#2A2A2A] bg-[#0A0A0A] p-8">
              <h3 className="font-[family-name:var(--font-oswald)] text-2xl text-[#D4A017] mb-6">Traditional Rules (Yoe Yar)</h3>
              <ul className="space-y-3 text-[#888888] text-sm">
                <li className="flex gap-3"><span className="text-[#C41E1E] mt-0.5">▶</span>Knockout-only victories — no points, no decisions</li>
                <li className="flex gap-3"><span className="text-[#C41E1E] mt-0.5">▶</span>Fights end in a draw if both remain standing</li>
                <li className="flex gap-3"><span className="text-[#C41E1E] mt-0.5">▶</span>Each corner gets one 2-minute revival timeout per fight</li>
                <li className="flex gap-3"><span className="text-[#C41E1E] mt-0.5">▶</span>3+ counts in one round OR 4+ total = TKO</li>
                <li className="flex gap-3"><span className="text-[#C41E1E] mt-0.5">▶</span>Bare knuckle — hands wrapped in hemp or gauze only</li>
              </ul>
            </div>
            <div className="border border-[#2A2A2A] bg-[#0A0A0A] p-8">
              <h3 className="font-[family-name:var(--font-oswald)] text-2xl text-[#D4A017] mb-6">Tournament Rules (1996+)</h3>
              <ul className="space-y-3 text-[#888888] text-sm">
                <li className="flex gap-3"><span className="text-[#D4A017] mt-0.5">▶</span>Judges score on aggression, damage, blood, and strike volume</li>
                <li className="flex gap-3"><span className="text-[#D4A017] mt-0.5">▶</span>No injury timeouts — no draws possible</li>
                <li className="flex gap-3"><span className="text-[#D4A017] mt-0.5">▶</span>Maximum 3 knockdowns per round; 4 total ends the fight</li>
                <li className="flex gap-3"><span className="text-[#D4A017] mt-0.5">▶</span>3–5 rounds of 3 minutes each, 2-minute breaks</li>
                <li className="flex gap-3"><span className="text-[#D4A017] mt-0.5">▶</span>Used by World Lethwei Championship (WLC)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques */}
      <section id="techniques" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
          The Arsenal
        </span>
        <h2 className="font-[family-name:var(--font-oswald)] text-5xl font-bold mb-12">
          ALL <span className="text-[#C41E1E]">9 WEAPONS</span>
        </h2>

        <div className="space-y-8">
          {techniques.map((t) => (
            <div key={t.category} className="border border-[#2A2A2A] bg-[#111111]">
              <div className="px-6 py-4 border-b border-[#2A2A2A]">
                <h3
                  className="font-[family-name:var(--font-oswald)] text-xl uppercase tracking-wide"
                  style={{ color: t.color }}
                >
                  {t.category}
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {t.items.map((item) => (
                  <span
                    key={item}
                    className="text-sm text-[#888888] bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 text-center"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#111111] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[family-name:var(--font-oswald)] text-4xl font-bold mb-4">
            READY TO <span className="text-[#C41E1E]">TRAIN?</span>
          </h2>
          <p className="text-[#888888] mb-8">Find a gym near you or join the community.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gyms" className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm bg-[#C41E1E] hover:bg-[#E02020] text-white px-8 py-4 transition-colors">
              Find a Gym
            </Link>
            <Link href="/forum" className="font-[family-name:var(--font-oswald)] tracking-widest uppercase text-sm border border-[#2A2A2A] hover:border-[#888888] text-[#888888] hover:text-[#F5F0E8] px-8 py-4 transition-colors">
              Join the Forum
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
