================================================================================
01 - PORTFOLIO HUB
================================================================================
STATUS:   built, not yet deployed
STACK:    Next.js + React + TypeScript + Firebase
DEPLOY:   Cloudflare Pages  (free, no card, no bandwidth cap, ~500 builds/mo)
PRIORITY: DAY 1 - build this first, everything else links here

LIVE URL: not deployed yet. See README.md for the full setup, the cover-letter
          blurb, and the deploy settings. Once deployed, put the URL here.


--------------------------------------------------------------------------------
WHY THIS STACK SPECIFICALLY
--------------------------------------------------------------------------------
Inventra Inc. (Jobstreet 94844605) lists the requirement as:

    React / Next.js / Firebase / TypeScript

All four. This site is designed to close that gap literally rather than
hopefully. Build it in TypeScript. Wire Firebase properly (auth + a Firestore
collection for the project entries), not as a stub.

That way when a recruiter opens it, the answer to "have you worked with these?"
is a working link instead of a claim.


--------------------------------------------------------------------------------
WHAT IT CONTAINS
--------------------------------------------------------------------------------
  - Hero: name, one-line positioning, contact links
  - Projects section, one card per project (pulled from Firestore)
  - Per-project page: problem, stack, one decision + why, live link, repo link
  - Contact form writing to Firestore

Keep it small. Three projects, done well, beats twelve thin ones.


--------------------------------------------------------------------------------
STEPS
--------------------------------------------------------------------------------
  1. npx create-next-app@latest . --typescript --tailwind --app-router
  2. Create a Firebase project, enable Auth + Firestore
  3. Add firebase to the project, write a small data layer for the
     "projects" collection
  4. Build the pages
  5. Push to GitHub, connect to Cloudflare Pages (framework preset: Next.js)
  6. Confirm the live URL loads on mobile data, not just localhost

Skip step 6 and you'll ship a link that 404s on a phone in PH.


--------------------------------------------------------------------------------
PER-FOLDER CONVENTION
--------------------------------------------------------------------------------
When this is done, this folder needs:
  - the running source                                       [done]
  - the deployed live URL in this README                     [pending deploy]
  - a 2-3 sentence blurb, copy-pasteable into a cover letter [in README.md]


--------------------------------------------------------------------------------
OPTIONAL UPGRADE (do this only AFTER the site works)
--------------------------------------------------------------------------------
The Cloudflare Pages subdomain (site.pages.dev) looks disposable. Once this is
live and stable, consider ~$5 for a .me or .dev on Cloudflare Registrar.
Don't pay before you have something to show.


================================================================================