# Phil's Skill — the concierge meta-skill

The front door to [Phil's Skills](https://philsskills.ai). Describe a job in plain language and it pulls the right curated Claude Skill or MCP off the shelf — the best two or three, with Phil's verdict and how to install each.

## Files

| File | Role |
|---|---|
| `SKILL.md` | The skill itself — frontmatter + the concierge logic and response voice. |
| `skills.json` | **Offline fallback** index. Auto-generated from the repo README; not hand-edited. |
| `README.md` | This file. |

## How it works

- **Source of truth = the repo README.** At query time the skill reads the live `README.md` from `github.com/philmaggs/phils-skills` (`https://raw.githubusercontent.com/philmaggs/phils-skills/main/README.md`) and parses the entries from it. So it always reflects exactly what Phil has published — it can't drift.
- **`skills.json` is a fallback only**, used if the live fetch can't reach GitHub. It's generated from the README by `build-index.mjs` (at the repo root).
- **Voice:** responses are written in Phil's chat voice (matches the `phillip-writing-style` skill) — short, opinionated, dry, links and commands inline.

## Keeping the fallback fresh

The live read needs nothing. To keep the offline fallback in sync after editing the README, from the repo root:

```
node build-index.mjs
```

Never hand-edit `skills.json`. Placeholder entries (verdicts not yet written) are skipped automatically.

## Installing it

One line, via the [`skills` CLI](https://github.com/vercel-labs/skills) (works for Claude Code, Cursor, Codex, etc.):

```
npx skills add philmaggs/phils-skills --skill phils-skill
```

Then invoke with `/phils-skill`, or just describe a job ("find me a skill for turning a CSV into a deck") and it triggers on its description. (`npx skills add philmaggs/phils-skills --list` browses everything in the repo.)

_Made by Phil Maggs · part of [philsskills.ai](https://philsskills.ai)_
