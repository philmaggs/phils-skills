# Data-source collection recipes

The goal at collection time is always the same: gather a large, varied set of **the person's
own authored messages**, verbatim, grouped by who they were writing to. Below are per-source
recipes. Pick based on what's connected; combine sources when you can.

## How to judge if a source is rich enough

A source is a good *primary* if it can yield ≥150–200 of the person's own messages across
several different recipients/contexts within the time range. Chat usually clears this easily;
email often does; docs/wikis usually don't on their own. If the primary is thin, widen the
time range or add a second source before proceeding — and tell the user if the sample will
be weak.

## Slack / Teams / Discord (chat — usually the best primary)

- Find the person's own user ID first (search users by name/email).
- Pull their authored messages with a `from:<them>` + date filter, paginating fully.
- **Cover all channel types**: public channels, private channels, 1:1 DMs, group DMs. Each
  reveals a different register. Split these across parallel collection agents.
- Preserve emoji shortcodes, `@`-mentions, links, and formatting exactly.
- Capture, per message: text, date, channel/recipient, and (where visible) what they were
  replying to.

## Gmail / Outlook (email — best for long-form and external/formal register)

- Restrict to **sent** mail (their own writing) within the time range.
- Group by recipient type: internal vs external, and by individual where it matters.
- Email surfaces greeting/sign-off conventions, paragraphing, and how formal they get with
  outsiders — register signal that chat may not show.
- Strip quoted reply chains and signatures so you analyse only what they actually wrote.

## Notion / Confluence / Google Docs (supplement, not primary)

- Useful for considered, structured writing and domain vocabulary.
- Filter to docs **they authored/edited**; beware co-authored docs muddying the voice.
- Treat as a supplement to chat/email — docs alone are too sparse and too formal to capture
  conversational voice.

## PR / issue comments, support tickets, etc. (niche supplements)

- Good for a specific work register (terse, technical, review-oriented).
- Same rule: only their own authored comments, grouped by context.

## Imported export files

If the user provides an export (e.g. a JSON/CSV/zip of their messages) instead of a live
connector, parse it directly. Same principles: filter to their own messages, keep verbatim
text, group by recipient/context, and respect the time range.

## Collection-agent brief (reuse this when fanning out)

> Collect, verbatim, every message authored by <PERSON> in <SOURCE/SLICE> within <RANGE>.
> Group by recipient/channel; note the other party's role if inferable and what they were
> replying to. Preserve exact punctuation, capitalisation, emoji, line breaks, and typos —
> do not paraphrase or clean anything. End with a short note on patterns you noticed
> (typical length, formality, openers/closers). Completeness over brevity.
