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
      "ONNX Runtime",
      "Streamlit",
      "OTIO / EDL / XML",
    ],
    decision: {
      what: "Over-fetch the candidate pool, then cap how many clips any one source video can contribute - rather than capping after retrieving exactly the number needed.",
      why: "Plain top-k is dominated by whichever source happens to have the most clips: ten near-identical beach shots take all ten slots, and a shoot with more clips wins on luck rather than merit. The obvious fix is to cap per source after retrieving exactly k, and it does not work - once the top k are all from one source there is nothing left to diversify from, so the only remedy is to enlarge k and try again. So the search fetches twice what it needs and caps within that window. The second consequence was bigger: once the rule can be broken, it cannot be absolute. Hard-blocking one source per ten-minute window left four of fourteen lines with no clip at all, because a short script sits entirely inside one window and exhausts the corpus. A hole in an edit is worse than a repeated shot, so a rule that cannot be satisfied now degrades to a penalty and flags the line rather than vetoing it.",
    },
    blurb:
      "Built a pipeline that picks stock footage for each voiceover line and explains why - over-fetching the candidate pool so no single source can dominate, scaling the pool size to how specific each line is, and applying reuse and variety rules as penalties rather than vetoes so a short script can't leave gaps in the timeline. Built to run on a free host with no API key: local ONNX embeddings, measured at 226MB against a 512MB tier. The one-line version of the decision I'd defend in review is over-fetching before diversifying, because capping after exactly k has nothing left to cap with.",
    order: 1,
    // The full pipeline grew out of work that involved client material, so THAT
    // repository is not published and linking it would misrepresent it. What is
    // linked here is the standalone demo, which was written to run on a free
    // host with no API key and can be read on its own: it uses a synthetic,
    // seeded corpus rather than any real footage or client data. The demo is
    // not the full pipeline and the copy above does not claim it is - the
    // checkpointing, timeline export and LLM judge are absent from it by
    // design, and the repo's README says so.
    links: [
      { label: "Source", href: "https://github.com/davidpaulprospero/matcher-demo" },
    ],
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