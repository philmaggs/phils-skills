# Phil's Skills

**Curated, not aggregated.** A hand-picked shelf of Claude Skills & MCPs I've personally run - with a plain, opinionated verdict on each. No sponsorships, no affiliate links, nothing on this list I haven't tested myself.

🔗 **The full editorial shelf lives at [philsskills.ai](https://philsskills.ai)** - this repo is the index.

> There are tens of thousands of Claude Skills and MCP servers now, and the signal-to-noise is rough. Most are a prompt in a trench coat. A handful are genuinely brilliant. This list tells you which is which - from someone who actually ran them. A skill earns its place here for one reason: **I'd be annoyed to lose it.**

I lean creative - **design, copywriting, marketing, the making of things** - because that's the work I do, and the only work I can honestly judge. I'm not going to pretend to rate a database tool I've never had to live with.

---

## How the tiers work

Everything here is run on real work, then ranked - not with stars, but with a plain verdict:

| Tier | What it means |
|---|---|
| **Essential** | Changed how I work. Install before anything else. |
| **Recommended** | Earns its place in the regular rotation. |
| **Worth a look** | Niche, but excellent at its one thing. |

A **✦ Phil's Pick** marks the best in its corner - the one I'd hand a friend first.

**A note on links:** every entry points to the skill's *original source*. I don't re-host other people's work - I curate, credit, and link. Skills I've built myself live in [`/skills`](./skills).

---

## The Collection

### 🎛 Design & Interface

- **[Figma Skills](https://www.figma.com/community/skills)** — `Recommended` ✦ **Phil's Pick** — *Figma's official agent skills for acting on the canvas; `/figma-use` is the foundation.* **Verdict:** Slow - and I reach for it every time anyway. I point it at the exact nodes I want to riff on and it drops a first-draft layout straight onto the canvas, still fully editable. The speed was never the point - a rough draft you can push around beats a fast one you can't. **Reach for it when:** you want a first-draft layout you can actually edit - point it at the nodes you like and let it riff.

### ✒ Copywriting

- **[personal-voice-builder](./skills/personal-voice-builder)** — `Made by me` — *Builds a reusable writing-style skill from your own messages, so Claude writes as you — from any data source, not just Slack.* [Full writeup ↓](#personal-voice-builder)

### ↗ Marketing & Growth

_Coming soon._

### ▤ Docs & Decks

_Coming soon._

### ✶ Image & Motion

_Coming soon._

### ⌗ Build & Tooling

_Coming soon._

---

## personal-voice-builder

**Made by:** Phillip Maggs

A meta-skill that builds *other* skills: point it at your own messages and it produces a reusable "writing-style" skill that makes Claude write as you — plus an evidence-backed analysis of how you actually communicate.

**Why I made it.** I first built a one-off skill from my own Slack history that let Claude draft messages in my voice. It worked well enough that I wanted anyone to be able to do the same for themselves, from any data source — not just Slack. So I generalised the whole workflow into a single skill you can run.

**What it does.** It's source-agnostic: it detects your connected tools (Slack, email, Notion, docs, etc.), recommends the most data-rich source, and fans out to collect a large, verbatim sample of your own messages. It auto-detects how your tone shifts by audience (boss, peers, reports, customers, friends), extracts your fingerprints (gears, mechanics, openers/closers, persuasion patterns), and outputs an installable `SKILL.md` + verbatim `reference-examples.md` + an analysis report. It then evaluates the result against your real messages and tightens it.

**Why it's good.**
- **Grounded, not generic.** Every stylistic claim is backed by a real quote from your own writing — it won't flatten you into a polite generic voice.
- **Captures the contrasts.** The value is in how your register changes by audience and the gap between your one-word replies and your long memos — both of which it models explicitly.
- **Volume-gated.** It refuses to build from a thin sample and tells you to widen the source, so you don't get a hollow result.
- **Self-evaluating.** It ships with a built-in eval loop that scores its own output against your real messages and checks the common "over-polish" failure modes (over-formal, too clean, generic closers, paragraphing instead of fragmenting).
- **Benchmarked.** In testing across two opposite personas (a casual founder and a formal academic), the skill hit a 100% completeness pass rate vs 69% for an unguided baseline — the baseline frequently skipped the reference examples, analysis, eval, and packaging.

**How to use it.** In Cowork or Claude Code, just ask: *"analyse my Slack and build me a personal writing-style skill"* — or *"make Claude sound like me."* It'll ask a couple of scoping questions, then do the rest.

---

## On the bench (currently testing)

Honest about the process: these are in the queue, being run on real work before they earn a verdict. The descriptions below are factual - I haven't formed an opinion yet.

- **[frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)** (Anthropic) — embeds a real design system so generated UI stops looking generic.
- **[canvas-design](https://github.com/anthropics/skills/tree/main/skills/canvas-design)** (Anthropic) — design visual art in PNG and PDF.
- **[brand-guidelines](https://github.com/anthropics/skills/tree/main/skills/brand-guidelines)** (Anthropic) — apply brand colours and typography to artifacts.
- **[docx](https://github.com/anthropics/skills/tree/main/skills/docx) · [pptx](https://github.com/anthropics/skills/tree/main/skills/pptx) · [xlsx](https://github.com/anthropics/skills/tree/main/skills/xlsx) · [pdf](https://github.com/anthropics/skills/tree/main/skills/pdf)** (Anthropic) — real document files, not Markdown in a costume.
- **[skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)** (Anthropic) — a guide for building your own skills.
- **[algorithmic-art](https://github.com/anthropics/skills/tree/main/skills/algorithmic-art)** (Anthropic) — generative art with p5.js.

---

## Submit a skill

Found one worth sharing? I run every submission on real work before it makes the list. No promises - but I read every one.

Open an [issue](https://github.com/philmaggs/phils-skills/issues) with the skill name, a link, and the moment it saved you - or use the form at [philsskills.ai](https://philsskills.ai).

---

## Curated by

**Phil Maggs** — [linkedin.com/in/philmaggs](https://www.linkedin.com/in/philmaggs/)

*No sponsorships. No affiliate links. Nothing here I haven't run myself.*
