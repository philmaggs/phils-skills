/* Phil's Skills — "Color Blocks" — vanilla implementation.
   No framework, no build step. Renders the curated shelf from content.js.
   Hash-routed: #/  #/skill/:id  #/cats  #/category/:id  #/about  #/submit */
(function () {
  "use strict";

  /* ============ tiny DOM helper ============ */
  // h("div", {className, style:{}, onClick, ...attrs}, ...children)
  function h(tag, props) {
    var el = document.createElement(tag);
    var children = Array.prototype.slice.call(arguments, 2);
    if (props) {
      for (var k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
        var v = props[k];
        if (v == null || v === false) continue;
        if (k === "className") el.className = v;
        else if (k === "style" && typeof v === "object") {
          for (var s in v) el.style[s] = v[s];
        } else if (k.indexOf("on") === 0 && typeof v === "function") {
          el.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k === "value") el.value = v;
        else if (k === "disabled") el.disabled = !!v;
        else if (k === "html") el.innerHTML = v;
        else el.setAttribute(k, v);
      }
    }
    append(el, children);
    return el;
  }
  function append(el, kids) {
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) { append(el, c); continue; }
      el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    }
  }
  // parse an SVG string into a live node (template preserves SVG namespace)
  function svg(str) {
    var t = document.createElement("template");
    t.innerHTML = str.trim();
    return t.content.firstChild;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  /* ============ data helpers ============ */
  var CATEGORIES = window.CATEGORIES, TIERS = window.TIERS, KINDS = window.KINDS,
      SKILLS = window.SKILLS, FLAGSHIP = window.FLAGSHIP;

  function catOf(id) { return CATEGORIES.find(function (c) { return c.id === id; }) || {}; }
  function kindOf(skill) { return KINDS[skill.kind || "skill"]; }
  function getItem(id) {
    if (FLAGSHIP && FLAGSHIP.id === id) return FLAGSHIP;
    return SKILLS.find(function (x) { return x.id === id; });
  }
  var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(iso) {
    if (!iso) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      var d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }
    var ym = iso.match(/^(\d{4})-(\d{2})$/);              // "2026-05" -> "May 2026"
    if (ym) return MONTH_NAMES[parseInt(ym[2], 10) - 1] + " " + ym[1];
    return iso;                                            // "2026" or anything else, as-is
  }
  function copyText(t) {
    try { navigator.clipboard.writeText(t); }
    catch (e) {
      var ta = document.createElement("textarea");
      ta.value = t; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e2) {}
      document.body.removeChild(ta);
    }
  }

  /* ============ icons ============ */
  var ICON_PATHS = {
    search: '<circle cx="7.5" cy="7.5" r="5"/><path d="M11.5 11.5 L15 15"/>',
    arrow:  '<path d="M3 8h10"/><path d="M9 4l4 4-4 4"/>',
    arrowL: '<path d="M13 8H3"/><path d="M7 4 3 8l4 4"/>',
    grid:   '<rect x="2.5" y="2.5" width="4.5" height="4.5"/><rect x="9" y="2.5" width="4.5" height="4.5"/><rect x="2.5" y="9" width="4.5" height="4.5"/><rect x="9" y="9" width="4.5" height="4.5"/>',
    list:   '<path d="M3 4h10M3 8h10M3 12h10"/>',
    ext:    '<path d="M9 3h4v4"/><path d="M13 3 7 9"/><path d="M11 9v4H3V5h4"/>',
    check:  '<path d="M3 8.5 6.5 12 13 4.5"/>'
  };
  function Icon(name, size) {
    size = size || 16;
    return svg('<svg viewBox="0 0 16 16" width="' + size + '" height="' + size +
      '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      ICON_PATHS[name] + '</svg>');
  }

  var stampSeq = 0;
  function PickStamp(size) {
    size = size || 86;
    var id = "seal-arc-" + (++stampSeq);
    var wrap = h("div", { className: "stamp", style: { "--s": size + "px" }, "aria-label": "Phil's Pick" });
    wrap.appendChild(svg(
      '<svg viewBox="0 0 100 100">' +
        '<defs><path id="' + id + '" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>' +
        '<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
        '<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
        '<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="1.5 2.5"/>' +
        '<text font-family="var(--mono)" font-size="9.5" font-weight="700" letter-spacing="3.1" fill="currentColor" text-anchor="middle">' +
          '<textPath href="#' + id + '" startOffset="25%">PHIL’S  PICK</textPath></text>' +
        '<text font-family="var(--mono)" font-size="8" letter-spacing="2.4" fill="currentColor" text-anchor="middle">' +
          '<textPath href="#' + id + '" startOffset="75%">TESTED &amp; TRUE</textPath></text>' +
      '</svg>'));
    wrap.appendChild(h("div", { className: "stamp-center" }, "✦"));
    return wrap;
  }

  function TierBadge(tier) {
    var t = TIERS[tier];
    if (!t) return null;
    return h("span", { className: "tier tier-" + tier }, t.label);
  }
  function CatLabel(id) {
    var c = catOf(id);
    return h("span", { className: "card-cat" }, h("span", { className: "glyph" }, c.glyph), c.name);
  }
  function KindTag(skill) {
    if ((skill.kind || "skill") !== "mcp") return null;
    return h("span", { className: "kindtag" }, "MCP");
  }

  /* ============ install card (Claude Code / Cowork tabs) ============ */
  function InstallCard(item, compact) {
    var tabs = Object.keys(item.install);
    var current = tabs[0];
    var card = h("div", { className: "install" + (compact ? " install-compact" : "") });
    var tabRow = h("div", { className: "install-tabs" });
    var body = h("div", { className: "install-body" });

    function renderTabs() {
      clear(tabRow);
      // single install method (e.g. one npx line) → no point showing a lone tab
      tabRow.style.display = tabs.length > 1 ? "" : "none";
      tabs.forEach(function (k) {
        tabRow.appendChild(h("button", {
          className: current === k ? "on" : "", type: "button", "aria-pressed": String(current === k),
          onClick: function () { current = k; renderTabs(); renderBody(); }
        }, item.install[k].label));
      });
    }
    function renderBody() {
      clear(body);
      var data = item.install[current];
      data.lines.forEach(function (line) {
        var copyLbl = h("span", { className: "cmd-copy", "aria-live": "polite" }, "copy");
        var btn = h("button", {
          className: "cmd", type: "button", "aria-label": "Copy command: " + line,
          onClick: function () {
            copyText(line);
            copyLbl.textContent = "copied ✓";
            setTimeout(function () { copyLbl.textContent = "copy"; }, 1400);
          }
        }, h("span", { className: "cmd-prompt", "aria-hidden": "true" }, "$"),
           h("code", { "aria-hidden": "true" }, line), copyLbl);
        body.appendChild(btn);
      });
      body.appendChild(h("p", { className: "install-note" }, data.note));
    }
    renderTabs(); renderBody();
    card.appendChild(tabRow); card.appendChild(body);
    return card;
  }

  /* ============ flagship hero (the house skill) ============ */
  function FlagshipHero() {
    var f = FLAGSHIP;
    if (!f) return null;
    return h("section", { className: "flagship" },
      h("div", { className: "wrap flagship-grid" },
        h("div", { className: "flagship-lead" },
          h("div", { className: "flagship-kicker smallcaps" }, "✦ Start here"),
          h("h2", { className: "flagship-title" }, f.headline || f.name),
          h("p", { className: "flagship-one" }, f.oneLiner),
          h("div", { className: "flagship-meta" },
            h("a", { href: "#/skill/" + f.id }, "See how it works"),
            h("span", { className: "smallcaps" }, "Searches all " + SKILLS.length + " on the shelf")
          )
        ),
        h("div", { className: "flagship-install" },
          h("div", { className: "smallcaps install-head" }, "Install it in one line"),
          InstallCard(f)
        )
      )
    );
  }

  /* ============ skill card ============ */
  function SkillCard(skill) {
    // A real anchor: keyboard-operable for free, and the inner <h3> stays a heading.
    return h("a", { className: "card", href: "#/skill/" + skill.id },
      h("div", { className: "card-l" },
        h("div", { className: "card-top" }, CatLabel(skill.cat), KindTag(skill)),
        h("h3", { className: "card-title" }, skill.name)
      ),
      h("p", { className: "card-one" }, skill.oneLiner),
      h("div", { className: "card-foot" },
        TierBadge(skill.tier),
        skill.pick ? h("span", { className: "card-meta", style: { color: "var(--accent)" } },
          h("span", { "aria-hidden": "true" }, "✦ "), "Phil’s Pick") : null,
        h("span", { className: "card-meta" }, skill.author),
        h("span", { className: "card-arrow", "aria-hidden": "true" }, Icon("arrow", 17))
      )
    );
  }

  /* ============ masthead ============ */
  var NAV = [
    { key: "home", label: "The Collection", route: { view: "home" } },
    { key: "cats", label: "Categories", route: { view: "cats" } },
    { key: "about", label: "About", route: { view: "about" } },
    { key: "submit", label: "Submit", route: { view: "submit" } }
  ];
  var searchInput = null, navLinks = {};

  function Masthead() {
    var nSkill = SKILLS.filter(function (s) { return (s.kind || "skill") === "skill"; }).length;
    var nMcp = SKILLS.filter(function (s) { return s.kind === "mcp"; }).length;

    searchInput = h("input", {
      placeholder: "search the collection…",
      "aria-label": "Search the collection",
      onInput: function (e) { onSearch(e.target.value); }
    });

    var nav = h("nav", { className: "mast-nav", "aria-label": "Primary" });
    navLinks = {};
    NAV.forEach(function (n) {
      var a = h("a", { href: routeToHash(n.route) }, n.label);
      navLinks[n.key] = a;
      nav.appendChild(a);
    });

    return h("header", { className: "mast" },
      h("div", { className: "wrap" },
        h("div", { className: "mast-top" },
          h("div", { className: "mast-dateline smallcaps" },
            "Curated, not aggregated  ·  ", h("b", null, String(nSkill)), " skills  ·  ",
            h("b", null, String(nMcp)), " MCPs"),
          h("div", { className: "mast-tools" },
            h("div", { className: "mast-search" }, Icon("search", 14), searchInput))
        ),
        h("div", { className: "mast-head" },
          h("a", { className: "mast-title", href: "#/", "aria-label": "Phil’s Skills — home" },
            h("span", { className: "wordmark" }, "Phil", h("span", { className: "apos" }, "’"), "s Skills"),
            h("div", { className: "mast-sub" },
              "The few Claude skills and MCPs actually worth installing. Tested on real work, so you don’t have to wade through the rest.")
          ),
          nav
        )
      )
    );
  }
  function updateNav() {
    var v = route.view;
    function active(k) {
      return (k === "home" && (v === "home" || v === "skill")) ||
             (k === "cats" && (v === "cats" || v === "category")) ||
             (k === v);
    }
    Object.keys(navLinks).forEach(function (k) {
      navLinks[k].className = active(k) ? "active" : "";
    });
  }

  /* ============ newsletter (MailerLite-ready) ============ */
  function NewsletterBlock() {
    var card = h("div", { className: "news-card" });
    var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    var email = "";

    var input = h("input", {
      type: "email", placeholder: "you@example.com", "aria-label": "Email address",
      onInput: function (e) { email = e.target.value; btn.disabled = !emailRe.test(email); }
    });
    var btn = h("button", { type: "submit", disabled: true }, "Subscribe");

    var form = h("form", { className: "news-form", onSubmit: function (e) {
      e.preventDefault();
      if (!emailRe.test(email)) return;
      var action = (window.NEWSLETTER || {}).action;
      if (action) {
        var fd = new FormData(); fd.append("fields[email]", email);
        fetch(action, { method: "POST", body: fd, mode: "no-cors" }).catch(function () {});
      }
      clear(card);
      card.appendChild(h("div", { className: "news-done" },
        h("h3", null, "You’re on the list."),
        h("p", null, "Next time something earns a place on the shelf, it lands in your inbox.")));
    } },
      h("div", { className: "news-row" }, input, btn),
      h("span", { className: "news-fine" }, "A short note whenever the shelf changes. Unsubscribe anytime."));

    card.appendChild(h("div", { className: "news-grid" },
      h("div", { className: "news-lead" },
        h("div", { className: "smallcaps news-kicker" }, "The newsletter"),
        h("h3", null, "New skills, in your inbox."),
        h("p", null, "When a skill or MCP earns its place here, you hear about it first. No spam, no filler, just the ones worth your time.")),
      form));

    return h("section", { className: "newsletter" }, h("div", { className: "wrap" }, card));
  }

  /* ============ footer ============ */
  function Footer() {
    return h("footer", { className: "foot" },
      h("div", { className: "wrap" },
        h("div", { className: "foot-row" },
          h("div", null,
            h("div", { className: "foot-title" }, "Phil’s Skills"),
            h("div", { className: "foot-note" }, "No sponsorships. No affiliate links. Nothing on the shelf I haven’t run myself.")),
          h("div", { style: { textAlign: "right" } },
            h("div", { className: "smallcaps", style: { marginBottom: "8px" } },
              h("a", { href: "#/about" }, "About · "),
              h("a", { href: "#/submit" }, "Submit a skill · "),
              h("a", { href: "https://www.linkedin.com/in/philmaggs/", target: "_blank", rel: "noreferrer" }, "Phil Maggs")),
            h("div", { className: "foot-note", style: { textAlign: "right" } }, "© MMXXVI  ·  a personal project, kept honest"))
        )
      )
    );
  }

  /* ============ HOME ============ */
  var home = { kind: "all", cat: "all", tier: "all", sort: "featured", view: "grid" };
  function resetHomeFilters() { home = { kind: "all", cat: "all", tier: "all", sort: "featured", view: "grid" }; }

  function HomeView() {
    var all = SKILLS;
    var pick = all.find(function (s) { return s.pick; }) || all[0];

    var rows = all.filter(function (s) {
      if (home.kind !== "all" && (s.kind || "skill") !== home.kind) return false;
      if (home.cat !== "all" && s.cat !== home.cat) return false;
      if (home.tier !== "all" && s.tier !== home.tier) return false;
      if (state.query.trim()) {
        var q = state.query.toLowerCase();
        var hay = (s.name + " " + s.oneLiner + " " + s.verdict + " " + s.tags.join(" ") + " " + s.author).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    var tierRank = function (s) { return TIERS[s.tier].rank; };
    rows = rows.slice().sort(function (a, b) {
      if (home.sort === "az") return a.name.localeCompare(b.name);
      if (home.sort === "newest") return b.tested.localeCompare(a.tested);
      if (home.sort === "rated") return tierRank(b) - tierRank(a) || (b.pick - a.pick);
      return (b.pick - a.pick) || (tierRank(b) - tierRank(a));
    });

    var filtering = state.query.trim() || home.cat !== "all" || home.tier !== "all" || home.kind !== "all";

    function pickHero() {
      return h("section", { className: "hero" }, h("div", { className: "wrap" },
        h("div", { className: "hero-kicker smallcaps" }, "✦ Pick of the collection"),
        h("div", { className: "hero-grid" },
          h("a", { className: "hero-feature", href: "#/skill/" + pick.id },
            CatLabel(pick.cat),
            h("h3", null, pick.name),
            h("p", { className: "lede" }, pick.oneLiner),
            h("div", { className: "byline" }, TierBadge(pick.tier), "   by " + pick.author + "  ·  ", h("span", { className: "fauxlink" }, "read the verdict ", h("span", { "aria-hidden": "true" }, "→")))
          ),
          h("aside", { className: "hero-aside" },
            h("h4", null, "Also worth your time"),
            h("ol", { className: "hero-list" },
              all.filter(function (s) { return s.id !== pick.id && (s.tier === "essential" || s.pick); }).slice(0, 5).map(function (s, i) {
                return h("li", null, h("a", { href: "#/skill/" + s.id },
                  h("span", { className: "hl-num" }, String(i + 1).padStart(2, "0")),
                  h("span", { className: "hl-name" }, s.name + " ", h("em", null, catOf(s.cat).name))));
              }))
          )
        )));
    }

    var main = h("main");

    // The flagship "house skill" band anchors the top of the unfiltered home.
    if (!filtering) main.appendChild(FlagshipHero());

    /* filter bar */
    var seg = h("div", { className: "seg", role: "group", "aria-label": "Filter by type" });
    [["all", "All"], ["skill", "Skills"], ["mcp", "MCPs"]].forEach(function (pair) {
      seg.appendChild(h("button", { className: home.kind === pair[0] ? "on" : "", type: "button",
        "aria-pressed": String(home.kind === pair[0]),
        onClick: function () { home.kind = pair[0]; renderMain(); } }, pair[1]));
    });

    var catChips = h("div", { className: "chips", role: "group", "aria-label": "Filter by category" },
      h("button", { className: "chip" + (home.cat === "all" ? " on" : ""), type: "button",
        "aria-pressed": String(home.cat === "all"), onClick: function () { home.cat = "all"; renderMain(); } }, "All"));
    CATEGORIES.forEach(function (c) {
      catChips.appendChild(h("button", { className: "chip" + (home.cat === c.id ? " on" : ""), type: "button",
        "aria-pressed": String(home.cat === c.id),
        onClick: function () { home.cat = c.id; renderMain(); } }, c.name));
    });

    var tierChips = h("div", { className: "chips", role: "group", "aria-label": "Filter by tier" });
    Object.keys(TIERS).map(function (k) { return TIERS[k]; }).sort(function (a, b) { return b.rank - a.rank; }).forEach(function (t) {
      tierChips.appendChild(h("button", { className: "chip tier" + (home.tier === t.id ? " on" : ""), type: "button",
        "aria-pressed": String(home.tier === t.id),
        onClick: function () { home.tier = home.tier === t.id ? "all" : t.id; renderMain(); } }, t.label));
    });

    var sortSel = h("select", { className: "sortsel", id: "sort-by", "aria-label": "Sort the collection", value: home.sort,
      onChange: function (e) { home.sort = e.target.value; renderMain(); } },
      h("option", { value: "featured" }, "Featured"),
      h("option", { value: "rated" }, "Top rated"),
      h("option", { value: "newest" }, "Newest tested"),
      h("option", { value: "az" }, "A–Z"));
    sortSel.value = home.sort;

    var viewToggle = h("div", { className: "viewtoggle", role: "group", "aria-label": "View as" },
      h("button", { className: home.view === "grid" ? "on" : "", type: "button", "aria-label": "Grid view", "aria-pressed": String(home.view === "grid"),
        onClick: function () { home.view = "grid"; renderMain(); } }, Icon("grid")),
      h("button", { className: home.view === "list" ? "on" : "", type: "button", "aria-label": "List view", "aria-pressed": String(home.view === "list"),
        onClick: function () { home.view = "list"; renderMain(); } }, Icon("list")));

    main.appendChild(h("div", { className: "filterbar" },
      h("div", { className: "wrap", style: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" } },
        seg, catChips, h("div", { className: "filter-spacer" }), tierChips,
        h("div", { className: "filter-ctrl" }, h("label", { for: "sort-by" }, "Sort"), sortSel),
        viewToggle)));

    var grid = rows.length === 0
      ? h("div", { className: "empty" }, h("div", { className: "glyph", "aria-hidden": "true" }, "∅"), h("p", null, "Nothing in the collection matches that, yet."))
      : h("div", { className: home.view === "list" ? "list" : "grid" },
          rows.map(function (s) { return SkillCard(s); }));

    main.appendChild(h("section", { className: "wrap", style: { paddingTop: "30px", paddingBottom: "50px" } },
      h("div", { className: "sec-head" },
        h("h1", null, filtering ? "Filtered" : "The Collection"),
        h("span", { className: "count smallcaps" }, rows.length + " skill" + (rows.length === 1 ? "" : "s"))),
      grid));

    /* the Pick moves below the collection (flagship owns the top) */
    if (!filtering) main.appendChild(pickHero());
    if (!filtering) main.appendChild(NewsletterBlock());

    return main;
  }

  /* ============ SKILL DETAIL ============ */
  function SkillView(id) {
    var s = getItem(id);
    if (!s) return h("main", null, h("div", { className: "wrap empty" }, h("p", null, "That skill has wandered off the shelf.")));
    var related = SKILLS.filter(function (x) { return x.cat === s.cat && x.id !== s.id; }).slice(0, 3);

    var aside = h("aside", { className: "aside-card" });
    if (s.pick) aside.appendChild(h("div", { className: "aside-stamp" }, PickStamp(92)));
    var dl = h("dl", { style: { margin: "0" } });
    function spec(dt, dd, ddCls) { return h("div", { className: "spec" }, h("dt", null, dt), h("dd", { className: ddCls || null }, dd)); }
    dl.appendChild(spec("Type", kindOf(s).glyph + " " + kindOf(s).label));
    dl.appendChild(spec("Tier", TIERS[s.tier].label));
    dl.appendChild(spec(s.kind === "mcp" ? "Maintainer" : "Author", s.author));
    if (s.kind === "mcp") dl.appendChild(spec("Connects", s.connects));
    if (s.effort) dl.appendChild(spec(kindOf(s).specLabel, s.effort));
    if (s.tested) dl.appendChild(spec("Last tested", fmtDate(s.tested)));
    dl.appendChild(h("div", { className: "spec" }, h("dt", null, "Repository"), h("dd", { className: "mono", style: { fontSize: "13px" } }, s.repo)));
    aside.appendChild(dl);
    aside.appendChild(h("a", { className: "repo-btn", href: s.url || repoUrl(s), target: "_blank", rel: "noreferrer" },
      kindOf(s).sourceVerb, Icon("ext", 14)));
    aside.appendChild(h("div", { className: "tagrow" }, s.tags.map(function (t) { return h("span", { className: "tag" }, t); })));

    var article = h("article", null,
      h("div", { className: "detail-head" },
        CatLabel(s.cat),
        h("h1", null, s.name),
        h("div", { className: "detail-badges" }, TierBadge(s.tier), KindTag(s), h("span", { className: "card-meta" }, TIERS[s.tier].note))),
      h("p", { className: "detail-lede" }, s.oneLiner),
      h("div", { className: "detail-body" }, h("span", { className: "verdict-mark" }, "The verdict"), h("p", null, s.verdict)),
      h("div", { className: "usewhen" }, h("span", { className: "smallcaps" }, "Reach for it when"), h("p", null, s.useWhen)),
      s.install ? h("div", { className: "detail-install" }, h("span", { className: "verdict-mark" }, "Get it running"), InstallCard(s)) : null,
      related.length > 0 ? h("div", { style: { marginTop: "46px" } },
        h("div", { className: "sec-head" }, h("h2", null, "More in " + catOf(s.cat).name)),
        h("div", { className: "grid" }, related.map(function (r) { return SkillCard(r, function (id2) { go({ view: "skill", id: id2 }); }); }))) : null
    );

    return h("main", { className: "detail" }, h("div", { className: "wrap" },
      h("a", { className: "back", href: "#/" }, Icon("arrowL", 14), " Back to the collection"),
      h("div", { className: "detail-grid" }, article, aside)));
  }
  // repo is one of: a full URL, an "owner/repo" github slug, or a bare domain
  // (e.g. "agentskills.io" for the community entries).
  function repoUrl(s) {
    var r = s.repo;
    if (/^https?:\/\//.test(r)) return r;
    if (r.indexOf("/") !== -1) return "https://github.com/" + r;
    return "https://" + r;
  }

  /* ============ CATEGORIES INDEX ============ */
  function CatsView() {
    var count = function (id) { return SKILLS.filter(function (s) { return s.cat === id; }).length; };
    var grid = h("div", { className: "cat-grid" });
    CATEGORIES.forEach(function (c) {
      grid.appendChild(h("a", { className: "cat-cell", href: "#/category/" + c.id },
        h("span", { className: "cat-glyph", "aria-hidden": "true" }, c.glyph),
        h("div", null,
          h("h3", { className: "cat-name" }, c.name),
          h("p", { className: "cat-blurb" }, c.blurb),
          h("div", { className: "cat-count" }, count(c.id) + " skill" + (count(c.id) === 1 ? "" : "s") + " →"))));
    });
    return h("main", null, h("div", { className: "wrap", style: { paddingTop: "36px", paddingBottom: "56px" } },
      h("div", { className: "sec-head" }, h("h1", null, "Browse by category"),
        h("span", { className: "count smallcaps" }, CATEGORIES.length + " shelves")),
      grid));
  }

  /* ============ CATEGORY PAGE ============ */
  function CategoryView(id) {
    var c = catOf(id);
    var rows = SKILLS.filter(function (s) { return s.cat === id; })
      .sort(function (a, b) { return (b.pick - a.pick) || (TIERS[b.tier].rank - TIERS[a.tier].rank); });
    return h("main", null, h("div", { className: "wrap", style: { paddingTop: "36px", paddingBottom: "56px" } },
      h("a", { className: "back", href: "#/cats" }, Icon("arrowL", 14), " All categories"),
      h("div", { className: "hero-feature", style: { cursor: "default", marginBottom: "30px" } },
        h("span", { className: "cat-glyph", "aria-hidden": "true", style: { fontSize: "52px" } }, c.glyph),
        h("h1", { style: { fontSize: "46px", margin: ".1em 0 .2em" } }, c.name),
        h("p", { className: "lede" }, c.blurb)),
      h("div", { className: "sec-head" }, h("h2", null, "The shelf"), h("span", { className: "count smallcaps" }, rows.length + " skills")),
      h("div", { className: "grid" }, rows.map(function (s) { return SkillCard(s, function (sid) { go({ view: "skill", id: sid }); }); }))));
  }

  /* ============ ABOUT / MANIFESTO ============ */
  function AboutView() {
    return h("main", { className: "manifesto" }, h("div", { className: "wrap" },
      h("div", { className: "manifesto-grid" },
        h("div", null,
          h("h1", null, "A shelf, not a search engine."),
          h("p", { className: "drop" }, "There are tens of thousands of Claude Skills and MCP servers now, and the signal-to-noise ratio is, to put it gently, rough. Most are a prompt in a trench coat. A handful are genuinely brilliant. This site exists to tell you which is which, from someone who actually ran them."),
          h("p", null, "Skills and MCPs do different jobs. One teaches Claude a way of working; the other plugs it into a live tool. But the bar is the same: every entry here has been installed, used on real work, and kept or cut. Nothing is listed because it’s popular, because someone paid, or because the README looked tidy. If it’s on the shelf, it earned its place on the job."),
          h("div", { className: "pull" }, "“A skill makes the list for one reason: I’d be annoyed to lose it.”"),
          h("p", null, "I lean toward the creative end, design, copywriting, marketing, the making of things, because that’s the work I do and the work I can judge. The verdicts are opinionated on purpose. You can get a neutral feature list anywhere; taste is the thing worth showing up for."),
          h("p", null, "The list is small by design and stays that way. When something better comes along, something else comes off.")),
        h("aside", { className: "about-aside" },
          h("h4", null, "How a skill earns its tier"),
          h("div", { className: "rubric" }, h("b", null, "Essential"), h("span", null, "Changed how I work. Install before anything else.")),
          h("div", { className: "rubric" }, h("b", null, "Recommended"), h("span", null, "Earns its place in the regular rotation.")),
          h("div", { className: "rubric" }, h("b", null, "Worth a look"), h("span", null, "Niche, but excellent at its one thing.")),
          h("h4", { style: { marginTop: "26px" } }, "The ✦ Pick"),
          h("div", { className: "rubric" }, h("span", null, "The best in its corner of the collection. The one I’d hand a friend first.")),
          h("h4", { style: { marginTop: "26px" } }, "Curated by"),
          h("div", { className: "rubric" }, h("b", null, "Phil Maggs"), h("span", null,
            h("a", { href: "https://www.linkedin.com/in/philmaggs/", target: "_blank", rel: "noreferrer",
              style: { color: "var(--accent-ink)", borderBottom: "1px solid var(--rule)" } }, "linkedin.com/in/philmaggs")))))));
  }

  /* ============ SUBMIT ============ */
  function SubmitView() {
    var f = { kind: "skill", name: "", repo: "", cat: (CATEGORIES[0] || {}).id || "", why: "", you: "" };
    var wrap = h("div", { className: "wrap" });

    function buildForm() {
      var submitBtn = h("button", { className: "submit-btn", type: "submit", disabled: true }, "Send it to Phil");
      function refresh() { submitBtn.disabled = !(f.name.trim() && f.repo.trim() && f.why.trim()); }

      var kindSeg = h("div", { className: "seg seg-wide", role: "group", "aria-labelledby": "sub-kind-lbl" });
      [["skill", "A Skill"], ["mcp", "An MCP"]].forEach(function (pair) {
        var b = h("button", { type: "button", className: f.kind === pair[0] ? "on" : "",
          "aria-pressed": String(f.kind === pair[0]),
          onClick: function () {
            f.kind = pair[0];
            Array.prototype.forEach.call(kindSeg.children, function (c, i) {
              var on = (["skill", "mcp"][i] === f.kind);
              c.className = on ? "on" : "";
              c.setAttribute("aria-pressed", String(on));
            });
            nameLbl.textContent = f.kind === "mcp" ? "Server name" : "Skill name";
            nameInput.placeholder = f.kind === "mcp" ? "e.g. Figma MCP" : "e.g. Frontend Design";
          } }, pair[1]);
        kindSeg.appendChild(b);
      });

      var nameLbl = h("label", { for: "sub-name" }, f.kind === "mcp" ? "Server name" : "Skill name");
      var nameInput = h("input", { id: "sub-name", value: f.name, placeholder: "e.g. Frontend Design",
        onInput: function (e) { f.name = e.target.value; refresh(); } });
      var repoInput = h("input", { id: "sub-repo", value: f.repo, placeholder: "owner/repo or https://…",
        onInput: function (e) { f.repo = e.target.value; refresh(); } });
      var catSel = h("select", { id: "sub-cat", value: f.cat, onChange: function (e) { f.cat = e.target.value; } },
        CATEGORIES.map(function (c) { return h("option", { value: c.id }, c.name); }));
      var whyArea = h("textarea", { id: "sub-why", placeholder: "What did it do that nothing else did?",
        onInput: function (e) { f.why = e.target.value; refresh(); } });
      var youInput = h("input", { id: "sub-you", value: f.you, placeholder: "So I can credit you",
        onInput: function (e) { f.you = e.target.value; } });

      var form = h("form", { onSubmit: function (e) {
        e.preventDefault();
        if (f.name.trim() && f.repo.trim() && f.why.trim()) showThanks();
      } },
        h("div", { className: "field" }, h("span", { className: "field-label", id: "sub-kind-lbl" }, "What is it?"), kindSeg),
        h("div", { className: "field" }, nameLbl, nameInput),
        h("div", { className: "field" }, h("label", { for: "sub-repo" }, "Repository or link"), repoInput),
        h("div", { className: "field" }, h("label", { for: "sub-cat" }, "Best fit category"), catSel),
        h("div", { className: "field" }, h("label", { for: "sub-why" }, "Why it deserves a spot"), whyArea),
        h("div", { className: "field" }, h("label", { for: "sub-you" }, "Your name or handle (optional)"), youInput),
        submitBtn);

      clear(wrap);
      wrap.appendChild(h("div", { className: "submit-grid" },
        h("div", null,
          h("h1", null, "Found one worth sharing?"),
          h("p", { className: "lede" }, "I’m always hunting for the next skill that earns its place. Send it over and I’ll run it on real work before it ever makes the list. No promises, but I read every one."),
          h("div", { className: "pull", style: { fontSize: "22px", marginTop: "30px" } }, "Tell me what it does, and the moment it saved you.")),
        form));
    }

    function showThanks() {
      clear(wrap);
      var inner = h("div", { className: "wrap", style: { maxWidth: "560px" } },
        h("div", { className: "thanks" },
          PickStamp(104),
          h("h3", null, "Noted, and thank you."),
          h("p", null, "If it survives my testing, you’ll see it on the shelf. I read every submission personally.")));
      wrap.appendChild(inner);
    }

    buildForm();
    return h("main", { className: "submit" }, wrap);
  }

  /* ============ router ============ */
  var state = { query: "" };
  var route = { view: "home" };

  function parseHash() {
    var hsh = (location.hash || "#/").replace(/^#\/?/, "");
    var parts = hsh.split("/").filter(Boolean);
    if (parts.length === 0) return { view: "home" };
    if (parts[0] === "skill") return { view: "skill", id: parts[1] };
    if (parts[0] === "category") return { view: "category", id: parts[1] };
    if (parts[0] === "cats") return { view: "cats" };
    if (parts[0] === "about") return { view: "about" };
    if (parts[0] === "submit") return { view: "submit" };
    return { view: "home" };
  }
  function routeToHash(r) {
    if (r.view === "home") return "#/";
    if (r.view === "skill") return "#/skill/" + r.id;
    if (r.view === "category") return "#/category/" + r.id;
    return "#/" + r.view;
  }
  function go(r) {
    var hsh = routeToHash(r);
    if (location.hash !== hsh) location.hash = hsh;
    else handleRoute(); // same hash (e.g. already home) — still refresh
  }

  function onSearch(value) {
    state.query = value;
    if (route.view !== "home") { location.hash = "#/"; } // handleRoute will render home
    else renderMain();
  }

  var mainSlot = null;
  function renderMain() {
    var node;
    switch (route.view) {
      case "skill": node = SkillView(route.id); break;
      case "cats": node = CatsView(); break;
      case "category": node = CategoryView(route.id); break;
      case "about": node = AboutView(); break;
      case "submit": node = SubmitView(); break;
      default: node = HomeView();
    }
    var fresh = mainSlot.cloneNode(false); // keep position/id, swap contents
    fresh.appendChild(node);
    mainSlot.parentNode.replaceChild(fresh, mainSlot);
    mainSlot = fresh;
  }

  var ROUTE_TITLES = { home: "The Collection", cats: "Categories", about: "About", submit: "Submit a skill" };
  function titleFor(r) {
    var base = "Phil’s Skills";
    if (r.view === "skill") { var s = getItem(r.id); return (s ? s.name : "Skill") + " — " + base; }
    if (r.view === "category") { var c = catOf(r.id); return (c.name || "Category") + " — " + base; }
    var t = ROUTE_TITLES[r.view];
    return t ? t + " — " + base : base;
  }

  var prevView = null;
  function handleRoute() {
    route = parseHash();
    if (route.view === "home" && prevView && prevView !== "home") resetHomeFilters();
    updateNav();
    renderMain();
    document.title = titleFor(route);
    if (route.view !== "home") window.scrollTo(0, 0);
    // Move focus into the freshly-rendered view so keyboard/SR users aren't
    // stranded on a detached node. Skip on first paint (don't yank from top).
    if (prevView !== null && mainSlot) {
      mainSlot.setAttribute("tabindex", "-1");
      mainSlot.focus({ preventScroll: true });
    }
    prevView = route.view;
  }

  function boot() {
    var rootEl = document.getElementById("root");
    var app = h("div", { className: "ps-root" });
    app.appendChild(h("a", { className: "skip-link", href: "#app-main",
      onClick: function (e) { e.preventDefault(); mainSlot.setAttribute("tabindex", "-1"); mainSlot.focus(); mainSlot.scrollIntoView(); } }, "Skip to content"));
    app.appendChild(Masthead());
    mainSlot = h("div", { id: "app-main", tabindex: "-1" });
    app.appendChild(mainSlot);
    app.appendChild(Footer());
    clear(rootEl);
    rootEl.appendChild(app);
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
