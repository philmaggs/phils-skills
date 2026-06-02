#!/usr/bin/env node
/* Phil's Skills — content build step.
 *
 * SOURCE OF TRUTH: README.md (the curated shelf).
 * OUTPUT:          content.js (consumed by the website).
 *
 * Edit the shelf in README.md, then run:  node build.js
 * The site reads the regenerated content.js — no hand-editing of content.js.
 *
 * What it parses from each entry:
 *   #### [Name](url) ✦                         ✦ = Phil's Pick
 *   🟢 **Essential** · `MCP` · by Author · tested May 2026
 *   **One-line summary.**
 *   The verdict paragraph.
 *   _Connects to: …_                           (MCPs only)
 *   **Reach for it when:** …
 *   `tag` · `tag` · `tag`
 * Categories come from the `### <glyph> <Name>` headings + their _blurb_.
 *
 * Structural config the README doesn't carry — tier definitions, the kind
 * (Skill/MCP) metadata, and the "Phil's Skill" flagship band — lives here as
 * constants. The flagship is intentional site furniture (a placeholder for a
 * future house skill), not part of the shelf, so it is NOT read from the README.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const README = path.join(ROOT, "README.md");
const OUT = path.join(ROOT, "content.js");

/* ---------- structural config (not in the README) ---------- */
const TIERS = {
  essential:   { id: "essential",   label: "Essential",    note: "Install before anything else.",        rank: 3 },
  recommended: { id: "recommended", label: "Recommended",  note: "Earns its place in the rotation.",      rank: 2 },
  worth:       { id: "worth",       label: "Worth a look", note: "Niche, but excellent at its one thing.", rank: 1 }
};
const KINDS = {
  skill: { id: "skill", label: "Skill", plural: "Skills", glyph: "▣",
           blurb: "A folder of instructions Claude loads to do a task your way.",
           sourceVerb: "View source", specLabel: "Effort" },
  mcp:   { id: "mcp", label: "MCP", plural: "MCPs", glyph: "◆",
           blurb: "A server that wires Claude into a live tool or data source.",
           sourceVerb: "View server", specLabel: "Setup" }
};
const FLAGSHIP = {
  id: "phils-skill", flagship: true, kind: "skill", name: "Phil's Skill",
  cat: "build", tier: "essential", pick: true, author: "Phil Maggs",
  repo: "philmaggs/phils-skills", url: "https://github.com/philmaggs/phils-skills",
  tested: "2026-06", effort: "One command",
  headline: "Find the right skill in one line.",
  oneLiner: "Describe what you need in plain words and it does the rest — search, match, install.",
  verdict: "Every other entry on this shelf is something I found. This is the one I built. It's the index made executable. Tell it what you're doing in plain language, say 'find me something for turning a CSV into a deck', and it reads the live shelf, hands back the two or three that actually fit with my verdict, and gives you the line to install the winner. No hunting across repos. No wondering whether a thing is any good. The taste is already baked in, because only skills that earned a place on the shelf are searchable. It's the front door to everything else here.",
  useWhen: "You know the job, not the skill. Describe the problem and let it pull the right tool off the shelf.",
  tags: ["meta", "search", "installer", "the house skill"],
  install: {
    npx: { label: "Terminal", lines: ["npx skills add philmaggs/phils-skills --skill phils-skill"], note: "Then just describe the job. That's the whole trick." }
  }
};

const TIER_BY_EMOJI = { "🟢": "essential", "🔵": "recommended", "⚪": "worth" };
const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
                 Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

function slug(s) {
  return s.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function parseTested(s) {
  s = s.trim();
  const m = s.match(/([A-Z][a-z]{2})\w*\s+(\d{4})/);   // "May 2026"
  if (m && MONTHS[m[1]]) return m[2] + "-" + MONTHS[m[1]];
  const y = s.match(/(\d{4})/);                          // "2026"
  return y ? y[1] : s;
}
// "https://github.com/owner/repo" -> "owner/repo"; otherwise the hostname.
function prettyRepo(url) {
  const gh = url.match(/^https?:\/\/github\.com\/([^/]+\/[^/?#]+)/);
  if (gh) return gh[1];
  const host = url.match(/^https?:\/\/([^/?#]+)/);
  return host ? host[1].replace(/^www\./, "") : url;
}

function build() {
  const md = fs.readFileSync(README, "utf8");
  const lines = md.split(/\r?\n/);

  const categories = [];
  const skills = [];
  let curCat = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // category heading: "### <glyph> <Name>"
    const catH = line.match(/^###\s+(\S+)\s+(.+?)\s*$/);
    if (catH) {
      const glyph = catH[1], name = catH[2];
      let blurb = "";
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const b = lines[j].match(/^_(.+)_\s*$/);
        if (b) { blurb = b[1]; break; }
      }
      curCat = { id: slug(name), name, blurb, glyph };
      categories.push(curCat);
      i++; continue;
    }

    // entry heading: "#### [Name](url) ✦"
    const head = line.match(/^####\s+\[(.+?)\]\((.+?)\)\s*(✦)?\s*$/);
    if (head) {
      const name = head[1], url = head[2], pick = !!head[3];

      // collect the entry block until the next entry / category / hr / h2
      const block = [];
      let k = i + 1;
      for (; k < lines.length; k++) {
        if (/^(####|###|##|---)/.test(lines[k])) break;
        block.push(lines[k]);
      }

      const entry = {
        id: slug(name), kind: "skill", name,
        cat: curCat ? curCat.id : "", tier: "worth", pick: pick,
        author: "", repo: prettyRepo(url), url, tested: "",
        oneLiner: "", verdict: "", useWhen: "", tags: []
      };
      const verdictLines = [];

      block.forEach((raw) => {
        const t = raw.trim();
        if (!t) return;
        const tierEmoji = t.match(/^(🟢|🔵|⚪)/);
        if (tierEmoji) {
          entry.tier = TIER_BY_EMOJI[tierEmoji[1]];
          if (/`MCP`/.test(t)) entry.kind = "mcp";
          const by = t.match(/·\s*by\s+(.+?)\s*·\s*tested/i) || t.match(/·\s*by\s+(.+?)\s*$/i);
          if (by) entry.author = by[1].trim();
          const tested = t.match(/tested\s+(.+?)\s*$/i);
          if (tested) entry.tested = parseTested(tested[1]);
          return;
        }
        const uw = t.match(/^\*\*Reach for it when:\*\*\s*(.+)$/);
        if (uw) { entry.useWhen = uw[1].trim(); return; }
        const conn = t.match(/^_Connects to:\s*(.+?)_\s*$/);
        if (conn) { entry.connects = conn[1].trim(); return; }
        if (/^`[^`]+`(\s*·\s*`[^`]+`)*\s*$/.test(t)) {
          entry.tags = (t.match(/`([^`]+)`/g) || []).map((x) => x.replace(/`/g, ""));
          return;
        }
        const bold = t.match(/^\*\*(.+)\*\*$/);
        if (bold && !entry.oneLiner) { entry.oneLiner = bold[1].trim(); return; }
        verdictLines.push(t);
      });
      entry.verdict = verdictLines.join(" ").trim();
      skills.push(entry);
      i = k; continue;
    }

    i++;
  }

  if (!categories.length || !skills.length) {
    throw new Error("Parse produced no categories/skills — check README.md format.");
  }
  validate(categories, skills);

  const header =
    "/* AUTO-GENERATED by build.js from README.md. Do not edit by hand.\n" +
    "   Edit the shelf in README.md, then run: node build.js */\n\n";
  const body =
    "window.CATEGORIES = " + JSON.stringify(categories, null, 2) + ";\n\n" +
    "window.TIERS = " + JSON.stringify(TIERS, null, 2) + ";\n\n" +
    "window.KINDS = " + JSON.stringify(KINDS, null, 2) + ";\n\n" +
    "window.FLAGSHIP = " + JSON.stringify(FLAGSHIP, null, 2) + ";\n\n" +
    "window.SKILLS = " + JSON.stringify(skills, null, 2) + ";\n";
  fs.writeFileSync(OUT, header + body);

  const nSkill = skills.filter((s) => s.kind === "skill").length;
  const nMcp = skills.filter((s) => s.kind === "mcp").length;
  console.log("✓ content.js written — " + skills.length + " entries (" +
    nSkill + " skills · " + nMcp + " MCPs) across " + categories.length + " categories.");
}

function validate(categories, skills) {
  const catIds = new Set(categories.map((c) => c.id));
  const warns = [];
  skills.forEach((s) => {
    if (!catIds.has(s.cat)) warns.push(s.name + ": unknown category");
    if (!s.author) warns.push(s.name + ": missing author");
    if (!s.oneLiner) warns.push(s.name + ": missing one-line summary");
    if (!s.useWhen) warns.push(s.name + ": missing 'Reach for it when'");
    if (!s.tags.length) warns.push(s.name + ": no tags");
    if (s.kind === "mcp" && !s.connects) warns.push(s.name + ": MCP missing 'Connects to'");
    if (/do not publish|to be written|placeholder/i.test(s.oneLiner + " " + s.verdict))
      warns.push(s.name + ": looks like a placeholder verdict");
  });
  if (warns.length) {
    console.warn("⚠ " + warns.length + " content warning(s):");
    warns.forEach((w) => console.warn("   - " + w));
  }
}

build();
