import Link from "next/link";

export const metadata = {
  title: "Shop — Lethwei Gear | T-Shirts, Hoodies & Hats",
  description: "Represent Lethwei. Shop official t-shirts, hoodies, and hats.",
};

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#110000] to-[#0A0A0A]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <span className="font-[family-name:var(--font-oswald)] text-[#D4A017] text-sm tracking-[0.3em] uppercase mb-4 block">
            Represent
          </span>
          <h1 className="font-[family-name:var(--font-oswald)] text-6xl md:text-8xl font-bold leading-none mb-6">
            WEAR THE<br />
            <span className="text-[#C41E1E]">TRADITION</span>
          </h1>
          <span className="block w-16 h-[3px] bg-[#C41E1E] mb-6" />
          <p className="text-[#888888] text-lg max-w-xl leading-relaxed">
            Official Lethwei gear. T-shirts, hoodies, and hats built for warriors.
            Carry the spirit of the Art of 9 Limbs wherever you go.
          </p>
        </div>
      </section>

      {/* Shopify Buy Button embed placeholder */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-[#2A2A2A] bg-[#111111] p-12 text-center">
          <div className="font-[family-name:var(--font-oswald)] text-[#555555] text-2xl mb-4">
            SHOPIFY STORE LOADING
          </div>
          <p className="text-[#555555] text-sm mb-8">
            Connect your Shopify store to display products here.
            Add your Shopify Buy Button script below.
          </p>

          {/*
            TO INTEGRATE SHOPIFY:
            1. Create a Shopify store at shopify.com
            2. Go to Sales Channels → Buy Button
            3. Create a collection embed for your products
            4. Replace this placeholder with the generated <script> tag

            The embed will look like:
            <div id="collection-component-xxx"></div>
            <script>...</script>
          */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {["T-Shirt", "Hoodie", "Hat"].map((item) => (
              <div key={item} className="border border-[#2A2A2A] bg-[#0A0A0A] aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[#C41E1E]/30 font-[family-name:var(--font-oswald)] text-5xl mb-2">
                    {item === "T-Shirt" ? "👕" : item === "Hoodie" ? "🧥" : "🧢"}
                  </div>
                  <p className="font-[family-name:var(--font-oswald)] text-[#555555] tracking-widest uppercase text-sm">
                    {item}
                  </p>
                  <p className="text-[#333333] text-xs mt-1">Coming soon</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[#555555] text-xs mt-8">
            Products will appear here once the Shopify store is connected.
          </p>
        </div>
      </section>

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
