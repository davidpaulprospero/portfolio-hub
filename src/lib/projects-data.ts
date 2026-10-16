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
    // No public link for this one. The implementation grew out of work that
    // involved client material, so the repository is not published - linking it
    // from here would misrepresent that. The project itself is mine and is
    // described above; it just isn't open source. Don't add a repo URL to this
    // entry without checking that the repo can stand on its own first.
    links: [],
  },
  {
    slug: "transcription-reference-site",
    title: "WordPress Reference Site",
    tagline: "A WordPress + Elementor reference site built to learn the stack.",
    problem:
      "WordPress and Elementor are everywhere in agency and small-business work, and I had only used them as an occasional content editor. I wanted to actually build and maintain a site on the stack - theme structure, custom post types, Elementor's template system, the media library, backups - rather than claim familiarity with it. The subject is reference notes for my own transcription tool: the answers already existed in my head and in the tests, and writing them down was the cheapest way to check they were actually right. It gave the content model a real corpus to work against instead of three lorem-ipsum posts.",
    stack: ["WordPress", "Elementor", "PHP", "Custom post types", "MySQL"],
    decision: {
      what: "Model the content as custom post types instead of building pages out of page-builder templates.",
      why: "Elementor templates are quick to build and painful to maintain: the content ends up locked inside a template, so listing or filtering a set of entries means scraping layout JSON. Registering custom post types kept the data queryable and left the page builder responsible only for presentation. It cost more setup up front and meant the templates stayed reusable when the content set changed. One query helper is the single definition of how entries are filtered, and the archive, the shortcode and the public REST endpoint all route through it, so a third way to list entries cannot drift from the other two.",
    },
    blurb:
      "Built a WordPress + Elementor reference site to learn the stack properly - theme structure, custom post types, and queryable content rather than content trapped inside page-builder templates. The one decision I'd call out is using custom post types for the content so pages stayed queryable and the Elementor templates stayed reusable instead of becoming one-off layouts. The plugin and theme are both mine; WordPress and Elementor are free software I downloaded.",
    order: 2,
    links: [
      { label: "Live site", href: "https://davidprospero.rf.gd" },
      { label: "REST endpoint", href: "https://davidprospero.rf.gd/wp-json/refsite/v1/resources" },
      { label: "Source", href: "https://github.com/davidpaulprospero/refsite" },
    ],
  },
  {
    slug: "voice-transcription-tool",
    title: "Voice Transcription Tool",
    tagline: "Silence-trimming transcription that keeps your timestamps honest.",
    problem:
      "Transcribing one file is easy - it's a function call. Transcribing a batch is where it turns into an engineering problem: a model on a long recording can run out of memory or stall on a bad file, one failure shouldn't abandon the other thirty, and re-running a finished batch because the process died is wasted work. Underneath all of it sits a smaller problem that makes the output quietly wrong: the silence in a recording is still audio the model has to read.",
    stack: ["Python", "faster-whisper", "pydub", "pytest"],
    decision: {
      what: "Trim the silence before transcription, but return the speech regions alongside the trimmed audio and remap every returned timestamp back to the original timeline.",
      why: "Trimming is the obvious win - less audio in means less to process - but it silently breaks everything downstream, because the model reports timestamps against the shortened file and the subtitles drift earlier and earlier against the original recording. The tempting fix is to stop trimming. Instead the trimmer returns the speech regions it found, and a separate pass maps each one back to where it sat in the original, accounting for the crossfades between concatenated regions. The output stays correct no matter how aggressively the audio was cut, and the correctness lives in one testable function rather than being spread across every caller.",
    },
    blurb:
      "Built a Python transcription pipeline around a single local speech-to-text model, with the reliability layer that actually decides whether a batch finishes: a result cache so an interrupted run resumes instead of redoing work, a delta-aware index that only re-transcribes the parts of a recording that changed, and a retry budget that classifies failures as out-of-memory, transient, timeout or permanent so it retries the recoverable ones and stops on the rest. The design decision I'd defend in review is trimming silence before transcription and then remapping every timestamp back onto the original timeline, so the speedup doesn't come at the cost of subtitles that no longer line up.",
    order: 3,
    links: [
      {
        label: "Live demo",
        href: "https://transcription-tool-gvqlzxgdcddktnbpea2vwx.streamlit.app/",
      },
      { label: "Source", href: "https://github.com/davidpaulprospero/transcription-tool" },
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