# 01 - Portfolio Hub

Personal portfolio site — the central hub every job application links to.

**Live URL:** https://portfolio-hub-elv.pages.dev

Built to satisfy the Inventra Inc. requirement of
**React / Next.js / Firebase / TypeScript** as far as a quota wall allows:
React, Next.js and TypeScript are in real production use here. Firebase is
written and wired but **not connected** — see [What is NOT in use](#what-is-not-in-use).
Three of the four are live; don't paper over the fourth.

---

## The honesty boundary

Everything on this site is a **self-initiated project**. There is no client,
no contract, and no revenue behind any of them. The framing throughout is
"No client work yet — these are problems I picked to solve."

If you are asked "who was this for?", the intended answer is **"I invented it
to learn X"** — and that is a good answer, not a weak one. Please do not add
claims that wouldn't survive that question. Don't add fake metrics, fake
testimonials, or fake logos. If a claim is ambiguous, leave it out.

---

## Cover-letter blurb (copy-paste this)

> I build and ship small, complete tools end to end. My portfolio at
> **[LIVE_URL]** runs on Next.js 16 (App Router), TypeScript and Tailwind,
> deployed as a static export to Cloudflare Pages. It reads its content
> through a typed data layer with a bundled fallback, so the site renders even
> if the database is unreachable — the same resilience I'd want in production.
> The three projects on it are mine, not client work: a Python pipeline that
> matches stock footage to a voiceover script with resumable checkpointing and
> OTIO/EDL/XML export, a WordPress + Elementor site modelled on custom post
> types so content stays queryable, and a transcription pipeline that trims
> silence before transcription and then remaps the timestamps back onto the
> original timeline so the speedup doesn't leave you with subtitles that no
> longer line up. Each one is written up with the single design decision I'd
> defend in review.

**Shorter version, if the letter is tight:**

> I build and ship small, complete tools end to end — my portfolio at
> **[LIVE_URL]** runs on Next.js 16, TypeScript and Tailwind, deployed as a
> static export. The three projects on it are mine, not client work: a Python
> stock-footage matching pipeline with resumable checkpointing, a WordPress +
> Elementor site built on custom post types, and a transcription pipeline with
> result caching and error-classified retries so an interrupted batch resumes
> rather than restarting.

---

## Stack actually used

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16.4.1, App Router                          |
| Language   | TypeScript 5 (strict)                               |
| Styling    | Tailwind CSS v4                                      |
| Content    | Bundled TypeScript module (`src/lib/projects-data.ts`) |
| Hosting    | Cloudflare Pages (free tier, static export)         |

### What is NOT in use

**Firebase is not connected.** The Firestore client is written and wired
(`src/lib/firebase.ts`, `src/lib/projects.ts`, `firestore.rules`), but there
is no live Google Cloud project behind it — project creation has been blocked
on a Google Cloud quota. Until that changes:

- Project content is served from the bundled TypeScript module.
- The contact form renders *"The contact form is being connected. Email me
  directly in the meantime."* — `isFirebaseConfigured` is false.

So do not describe the site as running on Firebase, and do not claim the
security rules are deployed. They're written and reviewed, not active.
`scripts/firebase-setup.sh` finishes the job if the quota clears.

Also not in use: no authentication anywhere. There is no sign-in flow, no
user accounts, and no admin area. The README previously described a Firebase
Auth integration; that was aspirational and has been removed.

---

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the Firebase values
npm run dev                  # http://localhost:3000
```

### Firebase (one-time)

1. Create a project at <https://console.firebase.google.com>.
2. **Enable Firestore** (production mode — the rules file governs access).
3. **Register a web app**, copy its config into `.env.local` under the
   `NEXT_PUBLIC_FIREBASE_*` keys.
4. **Deploy the rules:**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # select your project
   firebase deploy --only firestore:rules
   ```
5. **Seed the projects collection:**
   ```bash
   # Generate a service account key in the console (Project settings >
   # Service accounts), store it OUTSIDE this repo, then:
   set GOOGLE_APPLICATION_CREDENTIALS=C:\secure\path\service-account.json
   npm run seed
   ```

Until steps 3–5 are done the site still builds and runs — it falls back to the
bundled project data in `src/lib/projects-data.ts`, and the contact form shows
"being connected" instead of a broken form.

### Personalising

Your name, email and social links come from `NEXT_PUBLIC_*` variables in
`.env.local` and in the Cloudflare Pages dashboard. **Don't put a real email
address in the committed source** — the repo is public, and the committed
defaults are obvious placeholders on purpose.

Project links use a `PENDING_*` marker until you have a real URL
(`isPendingLink()` in `src/lib/projects-data.ts`); the UI renders those as
"(soon)" rather than a link that 404s under a recruiter's finger. Only the
WordPress project is still pending. The transcription tool links to
[transcription-tool](https://github.com/davidpaulprospero/transcription-tool),
and the stock footage matcher has no link at all by choice — see the comment
on that entry in `projects-data.ts`.

---

## Deploying

Cloudflare Pages, deployed from the CLI:

```bash
npm run build
npx wrangler pages deploy out --project-name portfolio-hub --branch main
```

Needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the environment
(see `scripts/deploy.sh`).

Settings this project was created with:

- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Node version:** 22 (`.node-version` pins this in the repo)

### Why not automatic deploys on push

Two paths were tried and both dead-ended, which is why this is manual:

1. **Cloudflare's own Git integration** — the project was created via the CLI,
   which permanently locks it to "Direct Upload" mode. Cloudflare rejects the
   conversion: *"You cannot update the `source` object in a Direct Upload
   project."* Switching would mean creating a new project and taking a new URL.
2. **A GitHub Actions workflow** — written, committed, and failed twice with
   zero steps executed. The cause was not the workflow:
   *"The job was not started because your account is locked due to a billing
   issue."* Removing the workflow also meant removing the Cloudflare token from
   the repo's secrets, which is the better outcome regardless.

If the GitHub billing lock is ever resolved, the manual path keeps working
either way — this is a two-command deploy, not a fragile setup.

### Do not add a `public/_redirects` file

Cloudflare Pages already resolves `/projects/:slug` to `slug.html` on its own,
so an explicit rule for it is redundant — and because Pages served the rewrite
as a 308 aimed at the source URL, it put every project page into an infinite
redirect loop. That fault only appeared on the deployed site; it was invisible
locally.

### Why static export instead of SSR

This was the one genuinely non-obvious decision, so it's recorded here.

Cloudflare's "Next.js" framework preset on **Pages** uses
`@cloudflare/next-on-pages`, which only ever supported the Edge runtime and
breaks on Next.js 15/16. The supported full-stack paths today are
`@opennextjs/cloudflare` (Workers) and `vinext` (Workers, still beta). None of
them are a good thing to hang a site you need to be reliably live on.

So `next.config.ts` sets `output: "export"`, which emits a plain `out/` folder
of HTML/CSS/JS. Cloudflare Pages serves that natively — no adapter, no beta,
no runtime, and no cost or outage surface.

It also shaped the data design. With no server, any database read happens in
the browser, which is why the `projects` collection is public-read and the
`messages` collection is write-only in `firestore.rules`. Since Firebase
isn't connected yet, the site currently renders from the bundled module —
but the rules are written for the moment it is.

**The trade-off, stated plainly:** because every route is rendered at build
time, `generateStaticParams` cannot ask Firestore which projects exist. The
slug list therefore comes from `src/lib/projects-data.ts`, and
`scripts/seed-projects.mjs` mirrors that file into Firestore. Edit the `.ts`
file, then re-run `npm run seed` — the two must stay in step. If you add a
fourth project and skip the seed, it still appears on the site (from the
bundled data) but won't be in the database.

---

## Firestore Security Rules (written, not deployed)

See [`firestore.rules`](./firestore.rules). **These are not currently active** —
there is no Firebase project to deploy them to. The owner email placeholder is
already filled in, so `firebase deploy --only firestore:rules` is all that
remains once a project exists.

The design, for whoever picks this up:

- `projects` — public read (it *is* the portfolio), owner-only write.
- `messages` — **`allow create` only**. Anyone can submit; nobody can read,
  update or delete. Only the project owner, signed in as the account that owns
  the Firebase project, can read submissions. The point is that the public
  endpoint cannot be used to harvest other visitors' contact submissions.
- Everything else is denied by the catch-all `match /{document=**}`.

The write-only model is the interesting part: a public contact form with public
read access would let anyone query the collection and harvest every visitor's
email address. Deployed as written, the endpoint accepts input and gives
nothing back.

---

## Scripts

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server                                      |
| `npm run build`     | Static export to `out/`                         |
| `npm run start`     | Serve the built `out/` locally                  |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | `tsc --noEmit`                                  |
| `npm run seed`      | Push `projects-data.ts` into Firestore          |

---

## Known issues

- **`npm audit` reports 5 high-severity advisories.** All are dev-only, in
  `braces` → `fast-glob` → `@next/eslint-plugin-next`. Nothing ships to the
  browser. The offered `npm audit fix --force` would *downgrade*
  `eslint-config-next` to 14.x, which breaks Next 16 linting — so it has
  deliberately not been applied. Revisit when upstream ships a fixed `braces`.
- **RSC prefetch 404s in some setups.** The static export writes `.txt` route
  payloads that `npx serve` (used by `npm run start`) doesn't resolve, so local
  preview logs a 404 on prefetch. Cloudflare Pages handles it correctly and
  navigation falls back to a full page load regardless — harmless.
- `next-env.d.ts` is gitignored, per the create-next-app default.

---

## Project layout

```
src/
  app/
    page.tsx                    home: hero, project grid, contact
    projects/[slug]/page.tsx    detail: problem, stack, one decision, links
    layout.tsx                  metadata + fonts
    globals.css                 theme tokens (light + dark)
  components/
    projects-grid.tsx           client-side Firestore read w/ seed fallback
    project-card.tsx            card in the home grid
    project-link.tsx            link, or "(soon)" placeholder
    contact-form.tsx            writes to the messages collection
  lib/
    firebase.ts                 client init (NEXT_PUBLIC_* only)
    projects.ts                 typed data layer: read projects, send message
    projects-data.ts            seed content — source of truth for slugs
    site-config.ts              name, positioning, contact links
    types.ts                    Project / ContactMessage
scripts/seed-projects.mjs       admin-SDK seed
firestore.rules
```