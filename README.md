# Phil's Skills

> A hand-picked shelf of Claude **Skills** and **MCPs** - found, tested, and vouched for. Curated, not aggregated. No sponsorships, no affiliate links, nothing listed I haven't run myself.

Curated by **Phil Maggs** · [LinkedIn](https://www.linkedin.com/in/philmaggs/)

🔗 **The full editorial shelf lives at [philsskills.ai](https://philsskills.ai)** - this repo is the index.

---

## How a skill earns its place

| Tier | Means |
|---|---|
| 🟢 Essential | Install before anything else. |
| 🔵 Recommended | Earns its place in the rotation. |
| ⚪ Worth a look | Niche, but excellent at its one thing. |
| ✦ Phil's Pick | The best in its corner of the collection. The one I'd hand a friend first. |

**A note on links:** every entry points to the skill's *original source*. I don't re-host other people's work - I curate, credit, and link.

---

## The collection

**19 skills · 6 MCPs**, grouped by category. Each entry links to its source.

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

🔧 **Source lives in this repo:** [`./skills/personal-voice-builder`](./skills/personal-voice-builder)

---

### ◑ Design & Interface
_Skills that raise the floor on anything visual - UI, brand, generative art._

#### [Figma MCP](https://github.com/figma/dev-mode-mcp-server) ✦
🟢 **Essential** · `MCP` · by Figma · tested May 2026
**Hands Claude your actual Figma frames - real layers, variables and specs, not a screenshot.**
This is the one that closes the gap between the design file and the build. Point Claude at a frame and it reads the real structure - the auto-layout, the variables, the spacing you actually set - instead of squinting at a flat picture and guessing. The output respects your tokens because it can finally see them. Setup takes a minute and Dev Mode is a prerequisite, but once it's running, "make it match the Figma" stops being a negotiation. If you ship design-to-code, this isn't optional.
_Connects to: Figma files & Dev Mode_
**Reach for it when:** Turning a real Figma design into faithful code without redrawing it by eye.
`figma` · `design-to-code` · `dev mode` · `official`

#### [Frontend Design](https://github.com/anthropics/skills) ✦
🟢 **Essential** · by Anthropic · tested May 2026
**Embeds a real design system so generated UI stops looking like generated UI.**
The one that quietly fixed the thing everyone moans about. It bans the tells - the purple gradients, Inter everywhere, the same rounded corners on everything - and swaps default taste for an actual point of view. Same prompt, output that looks like a grown-up made it. It won't replace a designer on client work, but your internal tools stop needing an apology. If you adopt one skill off this whole list, make it this one.
**Reach for it when:** Any time Claude is touching an interface and you don't fancy spending the afternoon de-slopping it.
`UI` · `design system` · `anti-slop` · `official`

#### [Artifacts Builder](https://github.com/anthropics/skills)
🔵 **Recommended** · by Anthropic · tested Apr 2026
**Multi-component interactive artifacts on React 18 + TypeScript + Tailwind + shadcn/ui.**
Where Frontend Design sets the taste, this one sets the scaffolding. Hand it a fuzzy idea and you get back something with structure - real components, sensible state, a stack you'd actually ship - not a clever toy. It rewards a sharp brief and punishes a vague one, so write the brief. Run it next to Frontend Design and the job splits cleanly: one decides how it looks, the other how it's built.
**Reach for it when:** Prototyping something that needs to behave, not just sit there looking pretty.
`React` · `Tailwind` · `shadcn` · `prototype`

#### [Brand Guidelines](https://github.com/anthropics/skills)
🔵 **Recommended** · by Anthropic · tested May 2026
**Applies a brand identity - colours, type, the rules - so output stops drifting off-brand.**
Deceptively boring, genuinely useful. Feed it the palette, the typefaces, the do's and don'ts, and everything downstream stops being a fight. The clever part isn't that it knows your brand - it's that it doesn't forget it by slide nine. The closest thing to handing Claude the brand book and trusting it read past the cover.
**Reach for it when:** You have a brand to protect and a team that keeps nudging things off it.
`brand` · `consistency` · `identity` · `official`

#### [Canvas / Generative Art](https://github.com/anthropics/skills)
⚪ **Worth a look** · by Anthropic · tested Mar 2026
**Museum-quality generative art in p5.js with seeded randomness and live parameters.**
The show-off of the collection, and it's earned the right. Seeded randomness lets you wander a whole space of variations and then walk straight back to the exact one you loved. It's 90% visual and 10% text by design, and - unlike most generative toys - it knows the line between sophisticated and cartoonish. Not an everyday tool, but when you need a cover or a backdrop with actual intent, nothing else here is close.
**Reach for it when:** You want art with intent - a cover, a backdrop, a print - not clip-art filler.
`p5.js` · `generative` · `print` · `creative coding`

---

### ¶ Copywriting
_Words that carry their weight. Voice, tone, and the craft of the sentence._

<!-- TODO (Phil): the "Tone of Voice" verdict was missing from the batch - fill this before publishing. Placeholder below keeps the count at 19 skills. -->
#### [Tone of Voice](https://agentskills.io) ✦
🟢 **Essential** · by Community · tested 2026
**⚠️ Verdict still to be written - Phil to provide. (Placeholder; do not publish as-is.)**
`voice` · `tone` · `copywriting`

#### [Longform Editor](https://agentskills.io)
🔵 **Recommended** · by Community · tested Apr 2026
**A ruthless line editor - cuts, tightens, and asks what the piece is really about.**
Most editing skills flatter you. This one is rude in the useful way - it cuts, it questions, and it kills the darling sentence you were proud of and were wrong to keep. The tell is the quality gate: after a couple of clean passes it starts asking what can come out rather than what can go in. That instinct alone earns its keep.
**Reach for it when:** The draft is done and you need a second set of eyes that won't be polite about it.
`editing` · `longform` · `structure` · `craft`

#### [Naming & Taglines](https://agentskills.io)
⚪ **Worth a look** · by Community · tested Feb 2026
**Generates names and lines with rationale, not just a list of words to ignore.**
Naming is mostly heartbreak and this won't fix that - but it beats the blank page handily. The trick is that it shows its working: why a name lands, what it evokes, where it'll trip. You'll bin most of them, as you should. Low keeper rate, good keepers - which is honestly the entire job.
**Reach for it when:** Early, when you need fifty bad names to find the one that isn't.
`naming` · `taglines` · `brainstorm` · `brand`

---

### ↗ Marketing & Growth
_CRO, SEO, email, positioning - the unglamorous engine room of growth._

#### [Marketing Skills](https://github.com/coreyhaines31/marketingskills) ✦
🟢 **Essential** · by Corey Haines · tested May 2026
**Twenty-plus skills - CRO, copy, SEO, email, A/B tests, growth - in a single install.**
Built for the founder wearing every hat at once, and it shows - in the good way. Instead of hunting individual skills across a dozen repos, here's one collection covering the whole growth surface in a consistent voice. Not every skill inside is a ten, but the median is high and the breadth is the point. If marketing is the side-quest you keep losing, start here.
**Reach for it when:** You're a small team doing marketing between everything else and need a baseline that doesn't embarrass you.
`CRO` · `SEO` · `email` · `growth` · `collection`

#### [SEO Content Brief](https://agentskills.io)
🔵 **Recommended** · by Community · tested Apr 2026
**Turns a target keyword into a structured, intent-mapped brief a writer can actually use.**
Most SEO output reads like it was written for a crawler and nobody else. This one starts from intent - what the reader is actually trying to do - and builds the outline outward from there. The briefs are tight, the headings earn their place, and it resists the urge to pad for word count. A quietly excellent first draft of the thinking, which is the bit most people skip.
**Reach for it when:** Before you write the article, when you want the shape of it to be right.
`SEO` · `content` · `briefs` · `intent`

#### [Slack MCP](https://github.com/modelcontextprotocol/servers)
🔵 **Recommended** · `MCP` · by Community · tested Apr 2026
**Reads channels and posts on your behalf - campaign updates and standups without the tab-switch.**
Less glamorous than it sounds, more useful than you'd expect. Claude can read a noisy launch channel, draft the update, and post it where the team already lives. Get the permission scoping right - read where you mean read - and Slack stops being a context sink and starts being where work lands. Connective tissue rather than a headline act, and none the worse for it.
_Connects to: Slack channels, threads & DMs_
**Reach for it when:** You want Claude to digest or post into Slack instead of you relaying it by hand.
`slack` · `comms` · `updates` · `automation`

#### [Market Research Scraper](https://github.com/browseract/skills)
⚪ **Worth a look** · by BrowserAct · tested Mar 2026
**Pulls pricing, ratings and positioning from a marketplace listing without tripping the bots.**
A one-trick specialist, and the trick is a good one. Point it at a product or a search and it comes back with the competitive picture - price, reviews, where a thing actually sits - in a single pass, while the browser-automation layer quietly does the boring job of not getting blocked. It trades an afternoon of forty open tabs for one prompt. That's a trade I'll make every time.
**Reach for it when:** Sizing up a market or a competitor and you'd rather not open forty tabs by hand.
`research` · `scraping` · `competitive` · `ecommerce`

---

### ▤ Docs & Decks
_Real .docx, .pptx, .xlsx and .pdf - not Markdown wearing a costume._

#### [PPTX Builder](https://github.com/anthropics/skills) ✦
🟢 **Essential** · by Anthropic · tested May 2026
**Generates genuine PowerPoint - editable shapes and text, not a screenshot of a deck.**
The skill that ended my relationship with "export this Markdown to slides" hacks. It makes real .pptx - proper text boxes, real shapes, a layout you can open in PowerPoint without weeping. Visual QA is baked in, on the sane assumption that something is always slightly off. Pair it with the spreadsheet skill and a CSV becomes a board-ready deck in one move.
**Reach for it when:** Anyone downstream is going to open the file in PowerPoint and judge you by it.
`pptx` · `slides` · `office` · `official`

#### [Notion MCP](https://github.com/makenotion/notion-mcp-server)
🔵 **Recommended** · `MCP` · by Notion · tested May 2026
**Lets Claude read and write your Notion - docs, databases, the lot - as a first-class citizen.**
The quiet workhorse if you live in Notion. Claude pulls the brief from a database, drafts the doc, and files it back where the team expects to find it - no copy-paste relay race. It respects your structure instead of dumping a wall of text onto a fresh page. The official server is refreshingly painless to set up. If your team's brain is in Notion, this hands Claude a key to the building.
_Connects to: Notion workspaces & databases_
**Reach for it when:** Your source of truth lives in Notion and you want Claude working inside it, not beside it.
`notion` · `docs` · `knowledge base` · `official`

#### [PDF Toolkit](https://github.com/anthropics/skills)
🔵 **Recommended** · by Anthropic · tested Apr 2026
**Extraction, form-filling and batch redaction - the canonical progressive-disclosure skill.**
Sounds like a press release - "AI does PDFs" - right up until it quietly changes how you handle contracts. A pre-written script reads the form fields without dragging the whole document into context, so it's fast and deterministic where it counts. It's the textbook example of a skill done properly, and it earns the cliché. The least glamorous tool here, and the one you'll reach for most.
**Reach for it when:** Anything PDF - pulling data out, filling forms in, redacting at volume.
`pdf` · `extraction` · `forms` · `official`

#### [XLSX Builder](https://github.com/anthropics/skills)
🔵 **Recommended** · by Anthropic · tested May 2026
**Real spreadsheets with live formulas - dynamic, not hard-coded numbers.**
The difference between this and "export the numbers to a table" is one word: formulas. It writes live ones, so the model stays alive - change an input and the sheet recalculates the way a spreadsheet is meant to, instead of sitting there as a fossil of numbers that were true once. Zero-error validation is the house rule, which is the only standard worth having when people are going to trust the totals. It doesn't show off - it just doesn't lie to you.
**Reach for it when:** The deliverable is a model someone will poke at, not a static table.
`xlsx` · `spreadsheets` · `formulas` · `office`

#### [DOCX Builder](https://github.com/anthropics/skills)
⚪ **Worth a look** · by Anthropic · tested Mar 2026
**Proper Word docs - tracked changes, TOC, footnotes, multi-column, the lot.**
The most thankless member of the Office trio, and the one legal teams quietly adore. Tracked changes, tables in real units, headers and footers that actually behave - it handles the fiddly Word machinery that usually detonates on export. You'll only notice it the day it saves you from reformatting a forty-page document by hand, which is precisely the day you'll be grateful.
**Reach for it when:** The output has to survive a Word-native review process with its formatting intact.
`docx` · `word` · `documents` · `office`

#### [Google Drive MCP](https://github.com/modelcontextprotocol/servers)
⚪ **Worth a look** · `MCP` · by Community · tested Mar 2026
**Search, read and reference your Drive so Claude works from the real document, not your paraphrase.**
The cure for the telephone game. Instead of paraphrasing the brief into the chat and hoping, you let Claude open the actual file in Drive and work from the source - fewer garbled facts, citations you can stand behind. OAuth is the one speed bump, and it's a one-time one. Unflashy - but once your assistant reads the real document instead of your summary of it, going back feels like working blindfolded.
_Connects to: Drive files, Docs & Sheets_
**Reach for it when:** The material Claude needs is sitting in Drive and you'd rather it read the source.
`google drive` · `docs` · `search` · `grounding`

---

### ✶ Image & Motion
_Prompts, frames and loops. The skills for making things move and shine._

#### [Image Prompt Generator](https://github.com/huangserva/skill-prompt-generator) ✦
🟢 **Essential** · by huangserva · tested May 2026
**Turns a described visual into professional, optimised prompts for image models.**
Prompt engineering for images is its own discipline, and most of us are amateurs at it. This one takes the picture in your head and writes the prompt language that actually gets you there - composition, lighting, lens, the vocabulary the models respond to. It collapses an hour of trial-and-error into one good first attempt. The closest thing to a translator between taste and tool.
**Reach for it when:** You can picture the image but keep fighting the model to get it out.
`prompts` · `text-to-image` · `generative` · `visual`

#### [Slack GIF Creator](https://github.com/anthropics/skills)
🔵 **Recommended** · by Anthropic · tested Apr 2026
**Animated GIFs tuned for Slack - eight motion concepts, ten ready-made themes.**
Pure delight, and it knows exactly how small it is. Shake, pulse, bounce, spin, fade - eight motion concepts and a stack of themes mean your team's in-jokes finally get a production budget. It will not change your business. It will absolutely improve a Thursday. Sometimes that's the whole brief, and this one nails it.
**Reach for it when:** Morale, celebration, or a launch that deserves more than a thumbs-up emoji.
`gif` · `animation` · `slack` · `fun`

---

### ⌗ Build & Tooling
_Meta-skills, MCP servers and the plumbing that makes the rest sing._

#### [Skill Creator](https://github.com/anthropics/skills) ✦
🟢 **Essential** · by Anthropic · tested May 2026
**The meta-skill: a skill for writing skills, with the frontmatter contract enforced.**
The bootstrap. It scaffolds new skills, enforces the YAML contract, and - most usefully - helps you write the description field, the bit nearly everyone fluffs and the bit that decides whether a skill ever fires. Pair it with the MCP builder and you've got a toolkit that extends itself. If you plan to live in this ecosystem rather than visit, this is the second thing you install.
**Reach for it when:** The moment you stop borrowing skills and start writing your own.
`meta` · `authoring` · `scaffolding` · `official`

#### [GitHub MCP](https://github.com/github/github-mcp-server)
🟢 **Essential** · `MCP` · by GitHub · tested May 2026
**Gives Claude the keys to your repos - issues, pull requests, reviews, the whole workflow.**
The official server, and the breadth shows. Claude can triage an issue, open a PR, leave a review, and check a failing Action without you leaving the conversation. The coverage is comprehensive rather than cute, and the error messages tell you what actually went wrong. Pair it with a code-review skill and you've got a real pair of hands on the repo. If your work has a GitHub side, install this early.
_Connects to: Repos, issues, PRs & Actions_
**Reach for it when:** You want Claude operating on real repos - not pasting diffs back and forth.
`github` · `git` · `pull requests` · `official`

#### [MCP Builder](https://github.com/anthropics/skills)
🔵 **Recommended** · by Anthropic · tested May 2026
**Generates Model Context Protocol servers from a plain description of what you need.**
Where Skills teach the workflow, MCPs expose the tools - and this writes the server that joins the two. It favours comprehensive API coverage over cute one-off helpers, names things sensibly, and writes error messages a human can act on. The ten-question intake feels like overkill until you see how much it sharpens the result. Plumbing - but the good kind you stop thinking about the moment it's in.
**Reach for it when:** You need Claude to reach a real external system and want the bridge built properly.
`MCP` · `servers` · `integration` · `official`

#### [Linear MCP](https://github.com/linear/linear-mcp)
⚪ **Worth a look** · `MCP` · by Linear · tested Mar 2026
**Turns a loose intention into a properly-shaped Linear issue, assigned and in the right cycle.**
A focused little server that does one workflow cleanly: it turns "we should fix the onboarding drop-off" into a real issue with the right project, labels and cycle. It won't run your sprint, but it kills the friction that means good ideas never get logged. Niche, tidy, exactly as ambitious as it needs to be - the kind of MCP you forget is even an integration.
_Connects to: Linear issues, projects & cycles_
**Reach for it when:** Capturing work into Linear without breaking flow to fill in the form.
`linear` · `issues` · `planning` · `ops`

#### [Webapp Testing](https://github.com/anthropics/skills)
⚪ **Worth a look** · by Anthropic · tested Mar 2026
**Drives a real browser with Playwright - reconnaissance first, then action.**
The discipline is the whole point: look before you leap - wait for the page to settle, screenshot it, find the selectors, then act. Never blind. That's why it doesn't flail the way naive automation does the moment a page loads half a second late. It won't decide what your tests should prove - that's still on you - but as a steady pair of hands on a live app, it's hard to fault. The unglamorous kind of reliable you stop worrying about.
**Reach for it when:** You need to verify a running web app actually does what it claims.
`testing` · `playwright` · `browser` · `QA`

---

## Quick index

| Skill | Category | Tier | Source |
|---|---|---|---|
| Figma MCP ✦ (MCP) | Design & Interface | Essential | [link](https://github.com/figma/dev-mode-mcp-server) |
| Frontend Design ✦ | Design & Interface | Essential | [link](https://github.com/anthropics/skills) |
| Image Prompt Generator ✦ | Image & Motion | Essential | [link](https://github.com/huangserva/skill-prompt-generator) |
| Marketing Skills ✦ | Marketing & Growth | Essential | [link](https://github.com/coreyhaines31/marketingskills) |
| PPTX Builder ✦ | Docs & Decks | Essential | [link](https://github.com/anthropics/skills) |
| Skill Creator ✦ | Build & Tooling | Essential | [link](https://github.com/anthropics/skills) |
| Tone of Voice ✦ | Copywriting | Essential | [link](https://agentskills.io) |
| GitHub MCP (MCP) | Build & Tooling | Essential | [link](https://github.com/github/github-mcp-server) |
| Artifacts Builder | Design & Interface | Recommended | [link](https://github.com/anthropics/skills) |
| Brand Guidelines | Design & Interface | Recommended | [link](https://github.com/anthropics/skills) |
| Longform Editor | Copywriting | Recommended | [link](https://agentskills.io) |
| MCP Builder | Build & Tooling | Recommended | [link](https://github.com/anthropics/skills) |
| Notion MCP (MCP) | Docs & Decks | Recommended | [link](https://github.com/makenotion/notion-mcp-server) |
| PDF Toolkit | Docs & Decks | Recommended | [link](https://github.com/anthropics/skills) |
| SEO Content Brief | Marketing & Growth | Recommended | [link](https://agentskills.io) |
| Slack GIF Creator | Image & Motion | Recommended | [link](https://github.com/anthropics/skills) |
| Slack MCP (MCP) | Marketing & Growth | Recommended | [link](https://github.com/modelcontextprotocol/servers) |
| XLSX Builder | Docs & Decks | Recommended | [link](https://github.com/anthropics/skills) |
| Canvas / Generative Art | Design & Interface | Worth a look | [link](https://github.com/anthropics/skills) |
| DOCX Builder | Docs & Decks | Worth a look | [link](https://github.com/anthropics/skills) |
| Google Drive MCP (MCP) | Docs & Decks | Worth a look | [link](https://github.com/modelcontextprotocol/servers) |
| Linear MCP (MCP) | Build & Tooling | Worth a look | [link](https://github.com/linear/linear-mcp) |
| Market Research Scraper | Marketing & Growth | Worth a look | [link](https://github.com/browseract/skills) |
| Naming & Taglines | Copywriting | Worth a look | [link](https://agentskills.io) |
| Webapp Testing | Build & Tooling | Worth a look | [link](https://github.com/anthropics/skills) |

---

_Last updated 2 June 2026. Built from the live site content. Tiers and verdicts are personal opinions from real testing._
