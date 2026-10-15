import type { Project } from "./types";

/**
 * Bundled seed content.
 *
 * Why this exists: the site is a static export, so every route is rendered at
 * build time and `generateStaticParams` cannot ask Firestore which slugs exist.
 * This file supplies the slug list to the build, and doubles as a runtime
 * fallback so the site still renders if Firestore is unreachable or empty.
 *
 * `scripts/seed-projects.mjs` pushes this same content into the Firestore
 * `projects` collection. Edit here, then re-run the seed script.
 *
 * HONESTY NOTE: these are self-initiated projects. There is no client, no
 * contract, and no revenue behind any of them. The copy is written to present
 * them that way. Please don't add claims that wouldn't survive "who was this
 * for?" - the answer "I invented it to learn X" is the intended one.
 */
export const seedProjects: Project[] = [
  {
    slug: "stock-footage-matcher",
    title: "Stock Footage Matcher",
    tagline: "A pipeline that cuts stock footage to a voiceover script.",
    problem:
      "Cutting stock footage to a voiceover by hand is slow and inconsistent: you read the script, search a stock library, judge whether a shot actually fits the line, then place it on a timeline. The judgement is the slow part. I wanted to automate the matching without handing the decision to something that would confidently pick a beach for a line about server latency.",
    stack: [
      "Python",
      "Embeddings",
      "LLM matching",
      "LLM-as-judge",
      "OTIO / EDL / XML",
    ],
    decision: {
      what: "Checkpoint every stage boundary to disk instead of re-running the whole pipeline after a failure.",
      why: "The first version re-ran from stage one on any error, and a mid-run LLM timeout meant re-paying for embedding the entire script. Because the stages are sequential and each one's output is a clean input to the next, persisting state at the boundaries turns a failed run into a resume. The second design consequence was that I could then make each stage independently retryable, which is what made the pipeline survivable against flaky network calls at all.",
    },
    blurb:
      "Built a five-stage Python pipeline (analyze, caption, match, download, output) that aligns stock footage to a voiceover script using embedding search for candidates and an LLM as the matcher, then exports OTIO, EDL and XML timelines. The design decision I'd defend in review is the on-disk checkpoint at every stage boundary, so a failure mid-run resumes instead of re-paying for the whole script's embeddings.",
    order: 1,
    links: [{ label: "Source", href: "https://github.com/davidpaulprospero/matcher" }],
  },
  {
    slug: "community-reference-site",
    title: "Community Reference Site",
    tagline: "A WordPress + Elementor reference site built to learn the stack.",
    problem:
      "WordPress and Elementor are everywhere in agency and small-business work, and I had only used them as an occasional content editor. I wanted to actually build and maintain a site on the stack - theme structure, custom post types, Elementor's template system, the media library, backups - rather than claim familiarity with it. I picked a community-information topic because the content requirements are real and I would have to keep it actually accurate.",
    stack: ["WordPress", "Elementor", "PHP", "Custom post types", "MySQL"],
    decision: {
      what: "Model the content as custom post types instead of building pages out of page-builder templates.",
      why: "Elementor templates are quick to build and painful to maintain: the content ends up locked inside a template, so listing or filtering a set of entries means scraping layout JSON. Registering custom post types kept the data queryable and left the page builder responsible only for presentation. It cost more setup up front and meant the templates stayed reusable when the content set changed.",
    },
    blurb:
      "Built a WordPress + Elementor community reference site to learn the stack properly - theme structure, custom post types, and queryable content rather than content trapped inside page-builder templates. The one decision I'd call out is using custom post types for the content so pages stayed queryable and the Elementor templates stayed reusable instead of becoming one-off layouts.",
    order: 2,
    links: [{ label: "Live site", href: "PENDING_WORDPRESS_URL" }],
    pendingUrl: true,
  },
  {
    slug: "voice-transcription-tool",
    title: "Voice Transcription Tool",
    tagline: "One transcription interface across three providers, with silence trimmed.",
    problem:
      "Speech-to-text providers disagree on cost, latency, and which one copes with a noisy recording, so the practical result of picking one is that you find out it was the wrong choice halfway through a batch. Two smaller problems came up along the way: most providers bill for silence, and a transcription that blocks the interface for the length of the file makes a tool feel broken. I built this to solve both the provider-lock-in problem and the two smaller ones.",
    stack: ["Python", "NumPy", "STT provider abstraction", "Async I/O"],
    decision: {
      what: "Vectorise voice-activity detection in NumPy instead of running a per-frame Python loop.",
      why: "The first VAD pass walked audio frame by frame in Python, and on an hour-long recording the detection step cost more wall-clock than the transcription it was meant to enable. Moving the frame maths into NumPy made it a handful of array operations over the whole signal, which brought detection well under the transcription time and stopped it being the bottleneck. It also made trimming cheap enough to run per segment rather than per file.",
    },
    blurb:
      "Built a Python voice transcription tool around an abstracted STT provider layer running across three backends, so the provider can be swapped without touching calling code. The design decision I'd point to is a NumPy-vectorised voice-activity detection pass that trims silence before it reaches the provider - it cut per-frame Python overhead so much that trimming became cheap enough to run per segment.",
    order: 3,
    links: [
      { label: "Live demo", href: "PENDING_STT_URL" },
      { label: "Source", href: "PENDING_STT_REPO_URL" },
    ],
  },
];

/**
 * Links left as `PENDING_*` are not real yet. The UI renders these as a
 * clearly-labelled placeholder instead of a link that 404s for a recruiter.
 */
export function isPendingLink(href: string): boolean {
  return href.startsWith("PENDING_");
}