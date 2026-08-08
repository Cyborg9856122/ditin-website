# Ditin Displays — website + admin panel

**Phase 3 of 4 done: public site.** Pixel pitch tool + placeholder catalogue data + polish is last.

## Stack

Next.js (App Router, TypeScript) · Supabase (Postgres, Auth, Storage) · Tailwind CSS · deploys to Netlify.

## Architecture

```
src/
  app/                    interface layer — pages, layouts, server actions
    layout.tsx             root: fonts + metadata only, no header/footer (shared by public + admin)
    (public)/               public site (route group, adds header/footer via its own layout.tsx)
      page.tsx              homepage — hero, rent vs. buy, category tiles
      catalogue/            product grid with filters + [slug] detail pages (statically generated)
      inquire/               standalone inquiry page + the shared InquiryForm + its server action
    admin/
      login/, forgot-password/, reset-password/   public auth pages
      (protected)/           everything behind auth (route group, guarded by layout.tsx)
        products/, inquiries/, users/
  lib/
    domain/                business logic — framework/DB agnostic
      types/               domain types + enum label maps
      auth/permissions.ts  role → capability rules (single source of truth)
      validation/          zod schemas (product, invite-user, inquiry)
      utils/               slugify, temp password generator
    data-access/            talks to Supabase, nothing else does
      supabase/             client factories: browser / server (cookies) / admin (service role) /
                             public (plain anon client, no cookies — for build-time & static contexts)
      repositories/         one file per table/aggregate, typed queries
    config/brand.ts         brand kit constants (colors, names, placeholder contact info)
```

Rule of thumb: UI code never calls Supabase directly — it goes through a repository in `data-access`. Role/permission checks live in `domain/auth/permissions.ts`, and every server action re-checks the role server-side (RLS enforces it at the database level too — this is defense in depth, not the only guard).

## What's live right now

- **Homepage** (`/`): hero, rent-vs-buy explainer linking into filtered catalogue views, a tile per category, and a closing CTA to the inquiry form.
- **Catalogue** (`/catalogue`): grid of published products only, filterable by category, indoor/outdoor, and rent/buy (a product marked "both" matches either specific filter). Empty state when nothing matches.
- **Product pages** (`/catalogue/[slug]`): statically generated at build time for every published product (`generateStaticParams`), photo gallery, full specs, and an embedded inquiry form pre-filled with that product. Unpublished/unknown slugs 404. Publishing, unpublishing, editing, or changing photos on a product from the admin panel now revalidates the live catalogue and that product's page — no manual rebuild needed.
- **Inquiry form**: one shared component used both standalone at `/inquire` and embedded on product pages, writing straight into the `inquiries` table (same one the admin inbox reads from — nothing new to wire up). Rental dates only appear when "Rent" is selected, matching the database's own constraint.
- **Header/footer**: real logo assets from your brand kit handoff (`public/brand/`), navigation, and a footer with category links and contact info.
- Everything from Phase 2 (admin panel: products, inquiries, users) is unchanged.

## ⚠️ Placeholders you need to fill in

I don't have your real contact details or service-area copy, so these are placeholders — search for them before launch:

- **`src/lib/config/brand.ts`** — `contact.whatsappNumber`, `whatsappDisplay`, `email`, `phone` are all fake. Used in the footer and the WhatsApp link.
- The homepage title in `src/app/layout.tsx` says "across Iraq" — I inferred that from the brand kit needing Arabic/Kurdish (Cairo) type, not from anything you told me. Confirm or correct it. (An earlier draft also named specific cities I'd invented — that's been removed.)
- No real product photos exist yet — the catalogue and product pages handle that gracefully (a "no photo yet" placeholder) but obviously need real photography.

## Setup

```bash
npm install
cp .env.local.example .env.local   # already filled in for you below
npm run dev
```

`.env.local` is already populated with the project URL and anon key. **You still need to add `SUPABASE_SERVICE_ROLE_KEY`** before user management will work — find it in Supabase Dashboard → Project Settings → API → service_role key. Never commit it or prefix it with `NEXT_PUBLIC_`. Everything else works without it.

## Creating the first Owner account

There's no public sign-up page by design. The first account has to be created directly in Supabase:

1. Supabase Dashboard → Authentication → Users → **Add user** → **Create new user**.
2. Set your email and a password.
3. Under **User Metadata**, add raw JSON:
   ```json
   { "role": "owner", "full_name": "Your Name" }
   ```
4. Save. A trigger automatically creates your `profiles` row with that role.
5. Go to `/admin/login` and sign in.

After that, once `SUPABASE_SERVICE_ROLE_KEY` is set, use `/admin/users` to create everyone else.

## Deploying to Netlify

A Netlify site named **ditin-website** exists under your Meraki team (`https://ditin-website.netlify.app` once deployed), with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` already set as environment variables there. Still needed:

- **Add `SUPABASE_SERVICE_ROLE_KEY`** to the site's environment variables (Netlify dashboard → Site configuration → Environment variables), same value as your local `.env.local`.
- **Trigger the actual deploy.** I can't do this from my sandbox — its outbound network can't reach Netlify's upload API (same restriction that blocks Google Fonts and direct Supabase calls at build time, see below). Pick one:
  - Connect the site to a GitHub repo (push this project there, then link it in Netlify → Site configuration → Build & deploy) for automatic deploys on every push — recommended.
  - Or from your own machine, with normal internet access: `npx netlify-cli link --id 105054de-249c-4b4a-b442-5f16a44c0681` then `npx netlify-cli deploy --prod`.

## A note on the build in this sandbox

`npm run build` can't fully complete inside my sandbox — its outbound network is allowlisted to package registries only, so it can't reach `fonts.googleapis.com`, and the catalogue's `generateStaticParams` (which needs to query Supabase directly at build time, not through the MCP tool) can't reach `*.supabase.co` either. Neither is a code problem: I verified everything else compiles and builds cleanly (TypeScript, ESLint, routing, every page, the static-generation setup for product pages) by temporarily stubbing just those two network calls. Netlify's build servers have normal internet access and will run the real thing.

## Brand kit

Logo files live in `public/brand/` (from your handoff zip): primary (ink-on-white), white (for dark backgrounds like the footer), ink, and accent variants. Colors: green `#06923E`, ink `#111111`/`#212121`, accent orange `#E67514` (used sparingly, never in the logo itself). Fonts — Chakra Petch (display), Barlow (body), IBM Plex Mono (measured values), Cairo (Arabic/Kurdish) — are all legitimately free Google Fonts, no substitution needed. Tagline "See Beyond the frame" appears once, in the footer only, per the handoff rules.

## Next phase

4. Pixel pitch tool (inside the LED block) + seed 12–15 placeholder products so the catalogue has content to browse + polish pass.
