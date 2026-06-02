#!/usr/bin/env node
/**
 * build-index.mjs — generates skills/phils-skill/skills.json from README.md
 *
 * README.md is the SINGLE SOURCE OF TRUTH for the curated collection.
 * This script parses it into a structured index the "phils-skill" meta-skill
 * reads. Run it after every change to README.md so the index never drifts:
 *
 *     node build-index.mjs
 *
 * No dependencies. Placeholder entries (verdict not yet written) are skipped.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const README = join(ROOT, 'README.md');
const OUT_DIR = join(ROOT, 'skills', 'phils-skill');
const OUT = join(OUT_DIR, 'skills.json');
const REPO = 'philmaggs/phils-skills';

const TIERS = { '🟢': 'Essential', '🔵': 'Recommended', '⚪': 'Worth a look' };

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const isPlaceholder = (t) => /⚠️|placeholder|do not publish|verdict still to be written/i.test(t);

const lines = readFileSync(README, 'utf8').split('\n');

function blockUntil(start) {
  const out = [];
  let j = start;
  for (; j < lines.length; j++) {
    const l = lines[j];
    if (/^####\s/.test(l) || /^###\s/.test(l) || /^##\s/.test(l) || /^---\s*$/.test(l)) break;
    out.push(l);
  }
  return { body: out, next: j };
}

const entries = [];
let category = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // category section header: "### ◑ Design & Interface"
  let m = line.match(/^###\s+(.+)$/);
  if (m) { category = m[1].replace(/^[^A-Za-z0-9]+/, '').trim(); continue; }

  // catalog entry: "#### [Name](url) [✦]"
  m = line.match(/^####\s+\[(.+?)\]\((.+?)\)\s*(✦)?\s*$/);
  if (m) {
    const name = m[1].trim();
    const url = m[2].trim();
    const pick = !!m[3];
    const { body, next } = blockUntil(i + 1);
    i = next - 1;
    const text = body.join('\n');
    if (isPlaceholder(text)) continue; // skip unpublished placeholders

    let tier = null, type = 'skill', author = null, tested = null;
    const TIERWORD = { essential: 'Essential', recommended: 'Recommended', 'worth a look': 'Worth a look' };
    const tierLine = body.find((l) => /\*\*(Essential|Recommended|Worth a look)\*\*/i.test(l));
    if (tierLine) {
      tier = TIERWORD[tierLine.match(/\*\*(Essential|Recommended|Worth a look)\*\*/i)[1].toLowerCase()] || null;
      if (/`MCP`/.test(tierLine)) type = 'mcp';
      const by = tierLine.match(/by\s+([^·]+?)\s*·\s*tested/i) || tierLine.match(/by\s+([^·]+)\s*$/i);
      if (by) author = by[1].trim();
      const ts = tierLine.match(/tested\s+([^·]+?)\s*$/i);
      if (ts) tested = ts[1].trim();
    }

    const summaryLine = body.find((l) => /^\*\*(?!Reach for it when)(.+)\*\*$/.test(l.trim()));
    const summary = summaryLine ? summaryLine.trim().replace(/^\*\*|\*\*$/g, '') : null;

    const connectsLine = body.find((l) => /^_Connects to:/i.test(l.trim()));
    const connects = connectsLine
      ? connectsLine.trim().replace(/^_Connects to:\s*/i, '').replace(/_$/, '').trim()
      : null;

    const reachLine = body.find((l) => /^\*\*Reach for it when:\*\*/i.test(l.trim()));
    const reach = reachLine ? reachLine.trim().replace(/^\*\*Reach for it when:\*\*\s*/i, '') : null;

    const tagsLine = body.find((l) => /^`.+`/.test(l.trim()) && l.includes('·'));
    const tags = tagsLine ? tagsLine.trim().split('·').map((s) => s.replace(/`/g, '').trim()).filter(Boolean) : [];

    const verdict = body.filter((l) => {
      const t = l.trim();
      if (!t || /^<!--/.test(t)) return false;
      if (tierLine && t === tierLine.trim()) return false;
      if (summaryLine && t === summaryLine.trim()) return false;
      if (/^_Connects to:/i.test(t)) return false;
      if (/^\*\*Reach for it when:\*\*/i.test(t)) return false;
      if (/^`.+`/.test(t) && t.includes('·')) return false;
      return true;
    }).join(' ').trim();

    const hosted = /github\.com\/philmaggs\/phils-skills/i.test(url) || /^\.\/skills\//.test(url) ? 'repo' : 'external';

    entries.push({
      id: slug(name), name, type, category, tier, pick,
      author, tested, source: url, hosted,
      ...(connects ? { connects } : {}),
      summary, verdict,
      ...(reach ? { reachForItWhen: reach } : {}),
      tags,
    });
    continue;
  }

  // Phil-authored featured block: "## name" containing "Source lives in this repo"
  m = line.match(/^##\s+([a-z0-9][\w-]+)\s*$/i);
  if (m) {
    const { body, next } = blockUntil(i + 1);
    const text = body.join('\n');
    if (!/Source lives in this repo/i.test(text)) continue; // only Phil-authored repo skills
    i = next - 1;
    const name = m[1].trim();
    const author = (text.match(/\*\*Made by:\*\*\s*(.+)/i) || [])[1]?.trim() || 'Phillip Maggs';
    const srcM = text.match(/Source lives in this repo:\*\*\s*\[.*?\]\((.+?)\)/i);
    const source = srcM ? srcM[1] : `./skills/${name}`;
    const prose = body.map((l) => l.trim()).filter(Boolean)
      .filter((l) => !/^\*\*Made by:/i.test(l) && !/Source lives in this repo/i.test(l) && !/^🔧/.test(l));
    const summary = prose[0] || null;
    entries.push({
      id: slug(name), name, type: 'skill', category: 'Build & Tooling',
      tier: 'Featured', pick: true, byPhil: true,
      author, tested: null, source, hosted: 'repo',
      summary, verdict: summary,
      tags: ['meta', 'build-your-own', 'voice'],
    });
    continue;
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const skills = entries.filter((e) => e.type !== 'mcp').length;
const mcps = entries.filter((e) => e.type === 'mcp').length;
const out = {
  generatedFrom: 'README.md',
  generatedAt: new Date().toISOString().slice(0, 10),
  repo: REPO,
  site: 'https://philsskills.ai',
  note: 'AUTO-GENERATED from README.md by build-index.mjs. Do not hand-edit. README is the single source of truth.',
  counts: { total: entries.length, skills, mcps },
  skills: entries,
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');

console.log(`Wrote ${entries.length} entries (${skills} skills · ${mcps} MCPs) to ${OUT}`);
console.log(entries.map((e) => `  [${(e.tier || '—').padEnd(11)}] ${e.name}  (${e.type}, ${e.hosted})`).join('\n'));
