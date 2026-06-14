# Lethwei — Project Notes

> Living doc. Update when decisions change, team changes, or new context arrives.

---

## What This Is

A Lethwei martial arts community + commerce site. Lethwei is a Burmese full-contact combat sport (headbutts allowed, no gloves). We own the name and are building the definitive English-language home for the sport in the US.

**Forum is legally required on the site — supports the trademark claim. Do not remove it.**

---

## Domains & Assets

| Asset | Purpose |
|-------|---------|
| lethwei.com | Commercial — merch, drop ship, print-on-demand |
| lethwei.org | Nonprofit — donations to poor Burmese kids who do lethwei |
| @lethweiofficial | Instagram |
| usalethwei.com | Owned by Tanner (future use TBD) |
| uslethwei.com | Owned by Tanner (future use TBD) |

**Physical inventory:** Grey + white tees already exist. "United States Lethwei Federation" branding, circular logo with stars, red/white/grey palette. These are the merch baseline.

---

## Business Model

- lethwei.com = commerce (drop ship + print-on-demand merch)
- % of profits from lethwei.com → lethwei.org nonprofit
- lethwei.org = nonprofit for Burmese kids who practice lethwei
- Roopa already runs a nonprofit and knows how to set this up
- Gym can serve as physical distribution hub

---

## Trademark

- Attorney: **Rose** — handling the Lethwei trademark
- We have **exclusive rights** to the Lethwei name/brand in this context
- The interactive forum on lethwei.com is a legal requirement to support the trademark

---

## Team

| Person | Role | Contact |
|--------|------|---------|
| Roopa Som | Site builder, product lead | ssom3@alumni.stanford.edu |
| Tanner | Ads, site feedback, domain portfolio owner | tanner@offmontanamarketing.com |
| Dean Rosenwald | Martial arts fan perspective, site feedback | dean.rosenwald@gmail.com |
| Gabe Schnider | Designs (simple, random, funny style) | gabeschnider@gmail.com |

- All team members use AI for everything
- Gabe's style: simple, random, funny — approached specifically for this
- Gabe can do designs for sale AND one-off ads on request
- Tanner runs ads professionally and manages 33 martial arts sites (all Squarespace)

**First kickoff:** Monday June 16, 2026 at 4pm PST

---

## Tanner's Domain Portfolio (Squarespace)

Tanner owns 33 martial arts sites — all active, all Squarespace. Covers muay thai + BJJ city domains across the US (ashland, bc, brazil, charlotte, dallas, denver, las vegas, maui, mexico, new orleans, oakland, pennsylvania, puerto rico, san francisco, twin cities, vegas, virginia, washington DC, etc.).

These are all potential apparel/drop-ship plays using the same model as lethwei.com. Once lethwei proves the model, these could all run on AI automation.

Reference site for design/UX: **www.santamonicastriking.com** (built by Tanner)

---

## lethwei.org — Current State

Already live on Squarespace, managed by Tanner. Will eventually become the nonprofit arm. Needs coordination between Tanner (Squarespace) and Roopa's Next.js build on lethwei.com.

---

## Brand

- Colors: red, white, grey
- Existing logo: circular with stars, official/federation aesthetic
- Entity name on shirts: "United States Lethwei Federation"
- Gabe's new designs should complement this but can be more casual/playful

---

## Background — Prateek (Previous Contractor)

Paid $500 upfront to a longtime associate (Prateek, India-based, usually charges $250/site) to build the site, set up an India bank account, and run drop ship + accounting. He never went live, made repeated excuses, eventually claimed the hosting company deleted everything. Roopa has already built an independent Next.js version. Waiting a couple days before fully moving on.

---

---

## Team Roadmap (Short Version)

**Phase 1 — Launch (now → kickoff):** Site live on Railway, merch pipeline configured, team roles locked.
**Phase 2 — Grow (month 1–2):** Tanner runs first paid ads, Gabe ships first design drop, forum seeded.
**Phase 3 — Nonprofit (month 3+):** lethwei.org entity set up, % of profits routing, donor page live.

| Who | Owns | AI tool |
|-----|------|---------|
| Roopa | Site (Next.js), product decisions | Claude Code |
| Tanner | Paid ads, campaign creative briefs | Claude / ChatGPT for copy |
| Gabe | Designs for merch + one-off ads | Midjourney / Adobe Firefly / Canva AI |
| Dean | Community feedback, forum seeding | — |

---

## Gabe's AI Design Workflow (Merch Pipeline)

### Tools
- **Midjourney** — image generation for concepts
- **Adobe Firefly / Illustrator AI** — vectorize, refine, make print-ready
- **Canva AI** — quick mockups on tee/hoodie/hat templates
- **Printful or Printify** — print-on-demand fulfillment (connects directly to the shop)

### Flow for each design drop
1. **Brief** (Roopa or Tanner → Gabe): "We want a [funny/hype/cultural] design around [theme]. Palette: red/white/grey or black. For [tee/hoodie/hat]."
2. **Ideate with AI**: Gabe prompts Midjourney with 4–6 variations. Style = simple, random, funny. Example prompt: `lethwei fighter silhouette, burmese temple background, bold graphic tee design, red and white, high contrast, flat vector style`
3. **Pick + refine**: Choose best 1–2 from the grid. Bring into Illustrator / Firefly to vectorize and clean edges.
4. **Mockup**: Drop into Canva AI tee/hoodie/hat template. Share in group chat for feedback.
5. **Upload to Printful/Printify**: Create product listing with 3 colorways (black, grey, white). Set margins.
6. **Live on lethwei.com shop**: New product goes up. Tanner gets notified to run an ad.

### Cadence (automated rhythm)
- **Monthly design drop**: 2–3 new designs per month minimum
- Gabe should batch ideation (1 session = 6–8 concepts), then refine the best 2–3
- Refreshed designs keep the shop feeling alive and give Tanner new ad creative constantly

### Design brief template for Gabe
```
Theme: [e.g. "headbutt is the 9th weapon", "Myanmar warrior", "no gloves no mercy"]
Vibe: [funny / hype / cultural / minimal]
Format: [tee / hoodie / hat / sticker]
Colors: [red+white+black / all black / etc.]
Must include: [logo? tagline? year?]
Reference: [santamonicastriking.com vibe / UFC merch / streetwear]
```

---

## Stack

- Next.js (App Router)
- Prisma ORM + PostgreSQL
- Auth.js / next-auth
- Railway deployment (`railway.toml`)
- Routes: `forum`, `shop`, `gyms`, `learn`, `api`, `auth`

Run locally: `npm run dev` from `/Users/roopasom/code/lethwei/`
