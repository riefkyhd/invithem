# Invithem

A single-wedding digital invitation website — lightweight, fast, and personalized. Built with Next.js 15, Supabase, and deployed on Vercel (free tier).

## Features

**Guest-facing**
- Cover screen with tap-to-open envelope animation
- Personalized greeting via `/?to=<slug>` query param
- Our story timeline, event details, countdown, gallery
- RSVP form, wishes wall, digital envelope (amplop digital)
- WhatsApp share, bilingual toggle (ID/EN), background music
- Add to calendar (.ics), optional livestream embed

**Admin dashboard** (`/admin`)
- Email/password login (Supabase Auth)
- Guest list CRUD with auto-generated invitation links
- CSV import, RSVP table with export
- Wishes moderation, wedding settings editor
- Gallery and music upload with image compression

## Tech Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- Supabase (Postgres, Auth, Storage, RLS)
- Framer Motion, react-hook-form + zod
- Vercel hosting

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Create a Supabase project

This repo is configured for **riefkyhdev's Org** → project **`invithem`** (`wiputhlabwxwjjelhdus`).

Dashboard: https://supabase.com/dashboard/project/wiputhlabwxwjjelhdus

Migrations are already applied. If setting up from scratch, run SQL from `supabase/migrations/` via the SQL editor or CLI:

```bash
npx supabase link --project-ref wiputhlabwxwjjelhdus
npx supabase db push
```

### 3. Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

- Guest site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel (Hobby plan)
3. Add environment variables in Vercel project settings
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL

## Multi-project architecture

Each authenticated account can own multiple wedding **projects**. Guest invitations live at:

```
/w/[projectSlug]?to=[guestSlug]
```

Admin dashboard: `/admin/projects` → select or create a project → manage guests, RSVPs, wishes, settings, and design per project.

Legacy links (`/?to=slug`) redirect to `/w/my-wedding?to=slug`.

## Custom domain (Vercel Hobby, zero extra cost)

A couple can point their own domain (e.g. `budi-ayu-wedding.com`) at the invitation:

1. In **Vercel** → Project → Settings → Domains, add the custom domain (Hobby plan supports one custom domain).
2. Configure DNS at the registrar (CNAME to `cname.vercel-dns.com` or A records as Vercel instructs).
3. Optional middleware rewrite: map the custom domain host to a project slug by adding a host→slug map in `middleware.ts`:

```typescript
const CUSTOM_DOMAINS: Record<string, string> = {
  "budi-ayu-wedding.com": "budi-ayu",
};
// if (host in CUSTOM_DOMAINS) rewrite to /w/${CUSTOM_DOMAINS[host]}
```

4. Set `NEXT_PUBLIC_SITE_URL` to the custom domain so share links and OG images use the correct origin.

## Day-of live mode

Cast wishes on a venue screen:

```
/w/[projectSlug]/live
```

Auto-scrolling guest book, no admin chrome.

## RLS regression test

After creating two test projects:

```bash
PROJECT_A_SLUG=my-wedding PROJECT_B_SLUG=test-b npx tsx scripts/rls-regression.ts
```

## Content to Fill In

Update via Admin → Settings or directly in `admin_settings`:

- Couple names, wedding date/times
- Ceremony and reception venue details
- Story milestones (JSON) with photos
- Bank account details for digital gifts
- Livestream URL (closer to event date)
- WhatsApp number for share button
- Background music (MP3, under 2–3MB)
- Gallery photos (20–30 curated, compressed)

## Design

- **Palette**: charcoal `#0B0B0A`, ivory `#F5F1EA`, sage accent `#6B7A5E`
- **Fonts**: Fraunces (display) + Inter (body) via `next/font`
- **Theme**: dark by default, light toggle available
- Mobile-first editorial layout

## CSV Guest Import Format

```csv
name,category,whatsapp_number
Budi Santoso,family,6281234567890
Ani Wijaya,friends,
```

Categories: `family`, `friends`, `VIP`, `colleagues`

## License

MIT
