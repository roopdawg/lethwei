import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Training", slug: "training", description: "Conditioning, sparring, drills, and training methodology.", icon: "🥊", order: 1 },
  { name: "Technique", slug: "technique", description: "Headbutt entries, elbow combos, clinch work, and the 9 limbs breakdown.", icon: "🧠", order: 2 },
  { name: "Events & Fights", slug: "events", description: "WLC cards, local events, fight results, and fight analysis.", icon: "🏆", order: 3 },
  { name: "General Discussion", slug: "general", description: "Culture, history, gear, and community — everything else.", icon: "💬", order: 4 },
  { name: "Find Training Partners", slug: "find-training", description: "Looking for sparring partners, coaches, or training camps near you.", icon: "🤝", order: 5 },
  { name: "New to the Art of 9 Limbs", slug: "beginners", description: "Just discovered the Art of 9 Limbs? Start here.", icon: "🌱", order: 6 },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  // The public /gyms page used to hard-code this listing; it now reads the
  // database, so the seed keeps it present and approved on every deploy.
  const wyoming = {
    name: "Wyoming Lethwei Association",
    city: "Cheyenne",
    state: "WY",
    country: "USA",
    website: "https://uslethwei.com",
    description: "One of the few US states where bare knuckle is fully sanctioned. Home base for US competition.",
    approved: true,
  };
  const existing = await prisma.gym.findFirst({ where: { name: wyoming.name } });
  if (existing) await prisma.gym.update({ where: { id: existing.id }, data: wyoming });
  else await prisma.gym.create({ data: wyoming });
  console.log("✅ Gyms seeded");

  // Staff accounts are named in the environment, never in code. The account
  // must already exist (sign up normally first); the seed only promotes it.
  //   ADMIN_EMAILS=a@x.com,b@y.com  MODERATOR_EMAILS=c@z.com  npm run seed
  const promote = async (list: string | undefined, role: "admin" | "moderator") => {
    for (const email of (list ?? "").split(",").map((e) => e.trim()).filter(Boolean)) {
      const r = await prisma.user.updateMany({ where: { email }, data: { role } });
      console.log(r.count ? `✅ ${email} → ${role}` : `⚠️  ${email} not found, sign up first`);
    }
  };
  await promote(process.env.ADMIN_EMAILS, "admin");
  await promote(process.env.MODERATOR_EMAILS, "moderator");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
