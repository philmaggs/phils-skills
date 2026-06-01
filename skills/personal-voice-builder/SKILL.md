---
name: personal-voice-builder
description: >
  Build a reusable "writing style" skill that makes Claude write as a specific person, by
  analysing a large sample of that person's real authored messages. Use this skill whenever
  someone wants Claude to "sound like me", "write in my voice", "learn my tone", "clone my
  writing style", "make a style guide", or "build a personal voice/writing skill" — and
  whenever they want to capture how they communicate across audiences (boss, peers, reports,
  customers, friends) and channels (chat, email, docs). It is source-agnostic: it detects
  available connectors (Slack, Gmail/email, Notion, Teams, docs, etc.), helps the user pick
  the most data-rich source, fans out subagents to collect verbatim samples, extracts tone /
  register / structure / habits, and produces an installable SKILL.md + reference examples +
  an evidence-backed analysis report, then evaluates the result against the person's real
  messages. Trigger it even if the user only says "analyse my Slack and make me a skill" or
  "turn my writing into a skill Claude can use later".
---

# Personal Voice Builder

This skill turns a person's real written messages into a reusable **writing-style skill**:
an installable `SKILL.md` (so Claude can draft as them), a `reference-examples.md` of their
verbatim samples, and an evidence-backed **analysis report**. It then **evaluates** the
result against held-out real messages and tightens it.

The deliverable mirrors a proven, high-quality output. Your job is to run the workflow
faithfully, ground every claim in real data, and never invent a generic "professional"
voice. The whole value is the *specific* person — their fingerprints, their register shifts,
their rough edges.

## Why this works (read this first)

A person's style is most visible in two places: the **contrast** between their short
throwaway replies and their long deliberate messages, and the way their **register shifts by
audience**. So the analysis must capture both, and the sample must be big and varied enough
to see them. Thin samples produce bland, generic skills. **Volume and variety are the whole
game.**

## Step 0 — Pick a data-rich source

You need a LOT of the person's own authored text — ideally hundreds of messages spanning
different people and contexts. Before anything else:

1. **Detect what's connected.** Look at available tools/connectors. Good high-volume sources,
   roughly best-first: team chat (Slack, Teams, Discord), email (Gmail, Outlook), messaging,
   then docs/wikis (Notion, Confluence, Google Docs), then PRs/issue comments. A source is
   only useful if it contains *the person's own writing* in quantity.
2. **Recommend the richest source, and say why.** Chat tends to win because it captures
   natural, audience-varied, high-frequency writing. Email is great for longer-form and
   external/formal register. Docs alone are usually too sparse and too formal to capture
   voice — fine as a *supplement*, weak as a *primary*.
3. **Let the user choose / combine.** Ask which source(s) to use. Combining (e.g. Slack +
   email) gives the best coverage of both quick and considered registers.
4. **Gate on volume.** If the chosen source can't yield at least ~150–200 of the person's own
   messages across varied recipients, say so plainly and either widen the time range, add a
   second source, or warn the user the result will be thinner. Do not proceed pretending a
   tiny sample is enough.

See `references/data-sources.md` for per-source collection recipes (search syntax, how to
filter to the person's own authored messages, channel/folder coverage).

## Step 1 — Clarify scope (brief, up front)

Ask a small number of questions before the heavy work — these materially change the output:

- **Time range** — last 3 months is a good default (current voice, fast, representative).
  Longer = more coverage but slower and may include stale style.
- **Deliverable** — default to the skill **plus** a separate analysis report, so the user
  gets the evidence, not just the rules.
- **Audience handling** — default to **auto-detecting** stakeholder groups from the data
  (who they actually write to and how) rather than asking them to pre-list groups. Offer the
  option to name specific people they most care about getting right.

Use the platform's question UI if available; otherwise ask inline, one short batch.

## Step 2 — Collect verbatim samples (fan out)

Gather the person's own messages, preserving them **verbatim** — exact punctuation,
capitalisation, emoji, line breaks, typos, formatting. The raw texture *is* the data.

If subagents are available, **parallelise** collection by splitting the work so each agent
returns a focused slice (this is faster and keeps context clean). Sensible splits:

- For chat: by channel type — public channels / 1:1 DMs / group DMs + private channels.
- For email: by direction/folder — sent items (primary), plus replies in threads.
- By time window if pagination caps out (e.g. month-by-month).

Each collection agent should return messages **grouped by recipient/channel**, with the
other party's role where inferable, what the person was responding to, and a short note on
patterns it noticed (length, formality, openers/closers). Tell agents: completeness over
brevity, do not paraphrase, capture every distinct message. Aim for ~300+ messages total
when the source allows.

If something about a recipient or context is unclear and it matters, spawn a small follow-up
agent to resolve identities/roles rather than guessing.

## Step 3 — Classify audiences

Cluster the recipients into stakeholder groups grounded in the data — e.g. senior
leadership, manager/sponsor, peers, engineers/specialists, customers/external,
cross-functional partners, junior/mentees, friends/personal. Note for each group: typical
length, formality, directness, warmth, and any signature moves. Look explicitly for a
**directionality rule** (e.g. does directness scale up or down with seniority?) — these
one-line traits are the most useful and the most revealing.

## Step 4 — Synthesise the patterns

Extract, with a real quote behind every claim:

- **Tone constants** — what holds across all audiences (candour, warmth, humour, hedging
  style, honesty markers, conviction markers).
- **Gears** — short vs long. How short is short? When do they go long, and how is a long
  message structured (opener → body → close)?
- **Mechanics / fingerprint** — emoji habits, punctuation tics (em dashes, ellipses), prefix
  shorthand, list style, capitalisation quirks, scare quotes, signature constructions,
  recurring phrasings, vocabulary, and characteristic typos.
- **Openers & closers** — how they start and end messages.
- **Register-by-audience table** — the heart of it (Step 3).
- **Persuasion / rhetorical patterns** — how they move people (framing, analogies, reframes).
- **Anti-patterns** — phrasings and formats that would read as *not them*.

## Step 5 — Produce the outputs

Create a skill folder `<firstname>-writing-style/` containing:

1. **`SKILL.md`** — operational drafting rules. Use the structure in
   `references/output-templates.md`. It must be usable on its own: the voice in a paragraph,
   gears, a register-by-audience table, a mechanics checklist, openers/closers, a persuasion
   playbook, vocabulary, what to avoid, an "on typos" note (default to clean text; only mimic
   rough edges on request), and a pre-send self-check.
2. **`reference-examples.md`** — verbatim real samples grouped by message type and audience,
   for pattern-matching.
3. **An analysis report** (`<Name>-writing-style-analysis.md`) — the evidence: registers,
   fingerprints, persuasion patterns, with quotes.

Follow the templates closely — they encode what a strong output looks like.

## Step 6 — Evaluate against real data (do not skip)

A first-pass voice skill reliably captures *content and vocabulary* but **over-polishes
form**. Test it honestly:

1. **Generate held-out drafts** — one short message per audience register, written using only
   the skill, for plausible scenarios NOT lifted from the sample.
2. **Score blind against real data** — ideally via an independent subagent that pulls the
   person's real messages per audience and scores each draft (register fit, length/cadence,
   mechanics, vocabulary, overall "would this pass as them?"), quoting the closest real
   message and naming specific "tells".
3. **Fix the systemic gaps**, then re-test the same scenarios to confirm improvement.

`references/eval-method.md` lists the **common over-polish failure modes** to check for
every time (fragmentation vs paragraphs, over-scaffolded diplomacy, explaining instead of
landing a one-liner, mis-placed signature tokens, text that's *too clean*, generic
corporate closers). These recur across almost everyone — check them explicitly.

## Step 7 — Package and deliver

- Bundle the skill folder into an installable `.skill` (zip the folder with a `.skill`
  extension) so the user can install it in Cowork / Claude Code, and present the files.
- Suggest keeping the analysis + reference docs in their notes/vault (e.g. Obsidian, a Claude
  Project) for portability.
- Offer a **monthly refresh** that re-samples recent messages and updates the skill as their
  voice drifts.

## Guardrails

- Only build a voice skill for the **person themselves** (or with their clear consent). This
  analyses someone's private messages — don't use it to impersonate a third party.
- Ground every stylistic claim in a real quote. If you can't cite it, don't assert it.
- Don't flatten the person into a polite generic voice — preserve the contrasts and the
  rough edges that make them recognisable.
