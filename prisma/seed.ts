import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Training", slug: "training", description: "Conditioning, sparring, drills, and training methodology.", icon: "🥊", order: 1 },
  { name: "Technique", slug: "technique", description: "Headbutt entries, elbow combos, clinch work, and the 9 limbs breakdown.", icon: "🧠", order: 2 },
  { name: "Events & Fights", slug: "events", description: "WLC cards, local events, fight results, and fight analysis.", icon: "🏆", order: 3 },
  { name: "General Discussion", slug: "general", description: "Anything Lethwei. Culture, history, gear, and community.", icon: "💬", order: 4 },
  { name: "Find Training Partners", slug: "find-training", description: "Looking for sparring partners, coaches, or training camps near you.", icon: "🤝", order: 5 },
  { name: "New to Lethwei", slug: "beginners", description: "Just discovered the Art of 9 Limbs? Start here.", icon: "🌱", order: 6 },
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
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
