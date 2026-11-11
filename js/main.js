/* =========================================================
   js/main.js
   Core rendering, navigation, preloader, and contact form.
   Visible content comes only from js/data.js (window.portfolioData).
   Load order: data.js -> main.js -> animations.js -> terminal.js
   ========================================================= */
(function () {
  "use strict";

  const D = window.portfolioData || {};

  /* ---------- Helpers (shared with animations.js and terminal.js via window.PF) ---------- */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const arr = (v) => (Array.isArray(v) ? v : []);
  const hasValue = (v) => v !== null && v !== undefined && (typeof v !== "string" || v.trim() !== "");

  const esc = (v) =>
    String(v === null || v === undefined ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // Placeholder text shipped in data.js. Any link or value matching this stays hidden.
  const PLACEHOLDER_RE = /your-|your_|example\.com|\[(your|start|end|year|team|e\.g\.)/i;
  const isUsable = (v) => hasValue(v) && !PLACEHOLDER_RE.test(String(v));
  const isUsableUrl = (v) => isUsable(v) && /^https?:\/\//i.test(String(v).trim());
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const getPath = (obj, path) =>
    String(path).split(".").reduce((o, k) => (o === null || o === undefined ? undefined : o[k]), obj);
  const skillName = (it) => (typeof it === "string" ? it : (it && it.name) || "");
  const prettyUrl = (u) => String(u).replace(/^(https?:\/\/|mailto:)/i, "").replace(/\/$/, "");
  const linkAttrs = (u) => (/^(mailto:|#)/i.test(u) ? "" : ' target="_blank" rel="noopener noreferrer"');
  const reducedMotion = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const pick = (...vals) => vals.find(hasValue);
  const setText = (sel, value) => {
    const el = $(sel);
    if (el && hasValue(value)) el.textContent = value;
  };
  const navHeight = () => {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"));
    return Number.isFinite(v) ? v : 76;
  };
  const ready = (fn) => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());

  const TYPE_META = {
    education: { label: "Education", icon: "fa-solid fa-graduation-cap" },
    learning: { label: "Learning Journey", icon: "fa-solid fa-book-open" },
    lab: { label: "Hands-on Lab", icon: "fa-solid fa-flask" },
    project: { label: "Technical Project", icon: "fa-solid fa-diagram-project" },
    ctf: { label: "CTF", icon: "fa-solid fa-flag-checkered" },
    milestone: { label: "Milestone", icon: "fa-solid fa-trophy" },
  };
  const SOCIAL_META = {
    github: { label: "GitHub", icon: "fa-brands fa-github" },
    linkedin: { label: "LinkedIn", icon: "fa-brands fa-linkedin-in" },
    instagram: { label: "Instagram", icon: "fa-brands fa-instagram" },
    tryhackme: { label: "TryHackMe", icon: "fa-solid fa-flag" },
  };
  const CERT_ICON = "fa-solid fa-award";

  // Terminal-style preloader lines. Edit the wording here if you like.
  const PRELOADER_LINES = [
    "Initializing secure boot sequence",
    "Loading cryptography modules",
    "Scanning network interfaces",
    "Verifying portfolio integrity",
    "Establishing encrypted session",
  ];

  window.PF = {
    $: $,
    $$: $$,
    esc: esc,
    data: D,
    reducedMotion: reducedMotion,
    isUsable: isUsable,
    isUsableUrl: isUsableUrl,
    prettyUrl: prettyUrl,
    linkAttrs: linkAttrs,
    skillName: skillName,
    getPath: getPath,
    ready: ready,
  };

  /* ---------- Data checks ---------- */

  function checkData() {
    if (!window.portfolioData) {
      console.error("[portfolio] js/data.js did not load. Check the script path in index.html.");
    }
    [
      "name", "hero", "about", "stats", "skills", "projects", "certificationCategories",
      "certifications", "experience", "contact", "terminal",
    ].forEach(function (key) {
      if (D[key] === undefined) console.warn('[portfolio] js/data.js has no "' + key + '" entry.');
    });
  }

  function warnPlaceholders(node, path, out) {
    if (typeof node === "string") {
      if (PLACEHOLDER_RE.test(node)) out.push(path + ': "' + node + '"');
    } else if (Array.isArray(node)) {
      node.forEach(function (v, i) { warnPlaceholders(v, path + "[" + i + "]", out); });
    } else if (node && typeof node === "object") {
      Object.keys(node).forEach(function (k) { warnPlaceholders(node[k], path ? path + "." + k : k, out); });
    }
    return out;
  }

  /* ---------- Rendering ---------- */

  function bindText() {
    $$("[data-bind]").forEach(function (el) {
      const value = getPath(D, el.getAttribute("data-bind"));
      if (hasValue(value)) el.textContent = value;
    });
  }

  function renderHero() {
    const hero = D.hero || {};
    setText("#heroGreeting", hero.greeting);
    setText("#heroStatus", D.status);
    setText("#heroDesc", hero.description);

    const heading = $("#heroHeading");
    if (heading && hasValue(hero.heading)) {
      const accents = arr(hero.highlight).map(function (w) { return String(w).toUpperCase(); });
      heading.setAttribute("aria-label", hero.heading);
      heading.innerHTML = String(hero.heading)
        .trim()
        .split(/\s+/)
        .map(function (word, i) {
          const accent = accents.indexOf(word.toUpperCase()) !== -1;
          return '<span class="word' + (accent ? " word--accent" : "") + '" style="--i:' + i +
            '" aria-hidden="true"><span>' + esc(word) + "</span></span>";
        })
        .join(" ");
    }

    const roles = arr(hero.roles);
    const roleEl = $("#typedRole");
    if (roleEl && roles.length) roleEl.textContent = roles[0];

    const cards = $("#heroFloatCards");
    if (cards) {
      cards.innerHTML = arr(hero.floatCards)
        .map(function (c, i) {
          const label = pick(c.label, c.title) || "";
          const value = pick(c.value, c.text) || "";
          return '<div class="float-card" style="--delay:' + (i * 0.6).toFixed(1) + 's">' +
            '<span class="float-card__icon"><i class="' + esc(c.icon) + '" aria-hidden="true"></i></span>' +
            "<div><small>" + esc(label) + "</small><strong>" + esc(value) + "</strong></div></div>";
        })
        .join("");
    }
  }

  function renderAbout() {
    const about = D.about || {};

    const img = $("#profileImg");
    if (img) {
      if (hasValue(D.profileImage)) img.src = D.profileImage;
      img.alt = D.profileImageAlt || "";
      img.loading = "lazy";
      img.decoding = "async";
    }

    setText("#aboutLead", about.lead);

    const bio = $("#aboutBio");
    if (bio && Array.isArray(about.bio)) {
      bio.innerHTML = about.bio.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    }

    const edu = $("#educationList");
    if (edu) {
      edu.innerHTML = arr(about.education)
        .map(function (e) {
          return "<li><strong>" + esc(pick(e.degree, e.title)) + "</strong><span>" +
            esc(pick(e.institution, e.org)) + "</span><small>" + esc(pick(e.period, e.date)) + "</small></li>";
        })
        .join("");
    }

    const interests = $("#interestList");
    if (interests) {
      interests.innerHTML = arr(about.interests).map(function (i) { return '<li class="chip">' + esc(i) + "</li>"; }).join("");
    }

    const goals = $("#goalsList");
    if (goals) {
      goals.innerHTML = arr(about.goals)
        .map(function (g) {
          return '<li><i class="fa-solid fa-chevron-right" aria-hidden="true"></i><span>' + esc(g) + "</span></li>";
        })
        .join("");
    }
  }

  function uniqueTech() {
    const seen = {};
    const names = [];
    arr(D.skills).forEach(function (cat) {
      arr(cat.items).forEach(function (it) {
        const n = skillName(it).trim();
        const key = n.toLowerCase();
        if (n && !seen[key]) {
          seen[key] = true;
          names.push(n);
        }
      });
    });
    return names;
  }

  function renderStats() {
    const grid = $("#statsGrid");
    if (!grid) return;
    const counts = {
      projects: arr(D.projects).length,
      technologies: uniqueTech().length,
      certifications: arr(D.certifications).length,
    };
    grid.innerHTML = arr(D.stats)
      .map(function (s) {
        const value = s.auto ? counts[s.auto] : s.value;
        const shown = value === undefined ? "" : value;
        const suffix = s.suffix || "";
        return '<article class="stat-card spotlight reveal">' +
          '<span class="stat-card__value" data-count="' + esc(shown) + '" data-suffix="' + esc(suffix) + '">' +
          esc(shown) + esc(suffix) + "</span>" +
          '<span class="stat-card__label">' + esc(s.label) + "</span>" +
          "</article>";
      })
      .join("");
  }

  function renderSkills() {
    const grid = $("#skillsGrid");
    if (!grid) return;
    grid.innerHTML = arr(D.skills)
      .map(function (cat) {
        const items = arr(cat.items)
          .map(function (it) {
            const name = skillName(it);
            const raw = it && typeof it === "object" ? it.level : undefined;
            const level = hasValue(raw) ? Number(raw) : NaN;
            const hasLevel = Number.isFinite(level) && level >= 0 && level <= 100;
            const meter = hasLevel
              ? '<div class="skill-meter" role="meter" aria-label="' + esc(name) +
                ' proficiency" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + level + '">' +
                '<span class="skill-meter__fill" style="width:' + level + '%"></span></div>'
              : "";
            return '<li class="skill-item"><span>' + esc(name) + "</span>" + meter + "</li>";
          })
          .join("");
        return '<article class="skill-card spotlight reveal">' +
          '<header class="skill-card__head">' +
          '<span class="skill-card__icon"><i class="' + esc(cat.icon || "fa-solid fa-shield-halved") +
          '" aria-hidden="true"></i></span>' +
          "<h3>" + esc(pick(cat.name, cat.title, cat.category) || "") + "</h3></header>" +
          '<ul class="skill-list">' + items + "</ul></article>";
      })
      .join("");
  }

  function renderProjects() {
    const grid = $("#projectsGrid");
    if (!grid) return;
    grid.innerHTML = arr(D.projects)
      .map(function (p, i) {
        const name = p.name || "Untitled project";
        const tags = arr(p.tech || p.technologies).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
        const spriteIndex = Number.isInteger(Number(p.spriteIndex)) ? Math.max(0, Math.min(7, Number(p.spriteIndex))) : i;
        const spriteColumn = spriteIndex % 4;
        const spriteRow = Math.floor(spriteIndex / 4);
        const spritePosition = (spriteColumn * 100 / 3) + "% " + (spriteRow * 100) + "%";
        const thumb = hasValue(p.thumbnail)
          ? '<div class="project-card__art" role="img" aria-label="' + esc(name) +
            ' illustrative project artwork" style="background-image:url(\'' + esc(p.thumbnail) +
            '\');background-position:' + spritePosition + '"></div>'
          : '<div class="project-card__art project-card__art--fallback" role="img" aria-label="' +
            esc(name) + ' project artwork unavailable"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div>';
        const github = isUsableUrl(p.github)
          ? '<a class="btn btn--ghost btn--sm" href="' + esc(p.github) +
            '" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository for ' + esc(name) +
            '"><i class="fa-brands fa-github" aria-hidden="true"></i> GitHub</a>'
          : "";
        const live = isUsableUrl(p.liveDemo)
          ? '<a class="btn btn--primary btn--sm" href="' + esc(p.liveDemo) +
            '" target="_blank" rel="noopener noreferrer" aria-label="Live demo for ' + esc(name) +
            '"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Live Demo</a>'
          : "";
        return '<article class="project-card spotlight reveal" aria-labelledby="project-title-' + i + '">' +
          '<div class="project-card__media">' + thumb +
          '<span class="project-card__category">' + esc(p.category || "Project") + "</span></div>" +
          '<div class="project-card__body">' +
          '<h3 class="project-card__title" id="project-title-' + i + '">' + esc(name) + "</h3>" +
          '<p class="project-card__desc">' + esc(p.description || "") + "</p>" +
          '<ul class="tag-list">' + tags + "</ul></div>" +
          (github || live ? '<div class="project-card__actions">' + github + live + "</div>" : "") +
          "</article>";
      })
      .join("");
  }

  function renderCertifications() {
    const grid = $("#certGrid");
    if (!grid) return;
    const certs = arr(D.certifications);
    const cats = arr(D.certificationCategories);

    const filters = $("#certFilters");
    if (filters) {
      const btn = function (value, label, count) {
        return '<button type="button" class="filter-btn" data-filter="' + esc(value) +
          '" aria-pressed="' + (value === "all") + '">' + esc(label) +
          ' <span class="filter-btn__count">' + count + "</span></button>";
      };
      filters.innerHTML =
        btn("all", "All", certs.length) +
        cats.map(function (c) {
          return btn(c, c, certs.filter(function (x) { return x.category === c; }).length);
        }).join("");
    }

    const fallback = '<div class="media-fallback" aria-hidden="true"><i class="' + CERT_ICON + '"></i></div>';
    const cards = certs
      .map(function (c) {
        const verify = pick(c.verifyUrl, c.url);
        const title = c.title || c.name || "Untitled";
        const media = hasValue(c.image)
          ? '<div class="cert-card__media"><a class="cert-card__preview" href="' + esc(c.image) +
            '" target="_blank" rel="noopener noreferrer" aria-label="View full certificate: ' + esc(title) +
            '"><img src="' + esc(c.image) + '" alt="' + esc(title) +
            ' certificate preview" loading="lazy" decoding="async" width="800" height="560"></a>' + fallback + "</div>"
          : '<div class="cert-card__media"><div class="cert-card__icon" aria-hidden="true"><i class="' +
            CERT_ICON + '"></i></div></div>';
        const meta = [c.issuer, c.date].filter(hasValue).join(" \u00B7 ");
        const certificateNumber = hasValue(c.certificateNumber)
          ? '<p class="cert-card__id">Certificate no. ' + esc(c.certificateNumber) + '</p>'
          : "";
        const link = isUsableUrl(verify)
          ? '<a class="text-link" href="' + esc(verify) + '" target="_blank" rel="noopener noreferrer" aria-label="Verify credential: ' +
            esc(title) + '">Open verification portal <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>'
          : "";
        return '<article class="cert-card reveal" data-category="' + esc(c.category) + '">' + media +
          '<div class="cert-card__body">' +
          '<span class="cert-card__cat">' + esc(c.category || "") + "</span>" +
          "<h3>" + esc(title) + "</h3>" +
          (meta ? '<p class="cert-card__meta">' + esc(meta) + "</p>" : "") +
          certificateNumber +
          (hasValue(c.description) ? '<p class="cert-card__desc">' + esc(c.description) + "</p>" : "") +
          '<div class="cert-card__links">' + link + "</div></div></article>";
      })
      .join("");

    const emptyStyle = "grid-column:1 / -1;" + (certs.length ? "display:none" : "");
    grid.innerHTML = cards +
      '<div class="empty-state" id="certEmpty" style="' + emptyStyle + '">' +
      '<i class="fa-solid fa-award" aria-hidden="true"></i>' +
      "<h3>No entries yet</h3>" +
      "<p>Verified certificates and achievements will be listed here.</p></div>";
  }

  function bindCertFilters() {
    const filters = $("#certFilters");
    const grid = $("#certGrid");
    if (!filters || !grid) return;
    filters.addEventListener("click", function (e) {
      const btn = e.target.closest ? e.target.closest(".filter-btn") : null;
      if (!btn) return;
      const value = btn.getAttribute("data-filter");
      $$(".filter-btn", filters).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      let shown = 0;
      $$(".cert-card", grid).forEach(function (card) {
        const match = value === "all" || card.getAttribute("data-category") === value;
        card.style.display = match ? "" : "none";
        if (match) shown += 1;
      });
      const empty = $("#certEmpty", grid);
      if (empty) empty.style.display = shown === 0 ? "" : "none";
    });
  }

  function renderTimeline() {
    const ol = $("#timeline");
    if (!ol) return;
    ol.innerHTML = arr(D.experience)
      .map(function (item) {
        const meta = Object.prototype.hasOwnProperty.call(TYPE_META, item.type)
          ? TYPE_META[item.type]
          : { label: "Entry", icon: "fa-solid fa-circle-dot" };
        const desc = pick(item.desc, item.description);
        return '<li class="timeline__item reveal">' +
          '<div class="timeline__node" aria-hidden="true"><i class="' + meta.icon + '"></i></div>' +
          '<article class="timeline__card spotlight">' +
          '<div class="timeline__meta"><span class="timeline__type">' + esc(meta.label) + "</span>" +
          "<time>" + esc(item.date || "") + "</time></div>" +
          "<h3>" + esc(item.title || "") + "</h3>" +
          (hasValue(item.org) ? '<p class="timeline__org">' + esc(item.org) + "</p>" : "") +
          (hasValue(desc) ? '<p class="timeline__desc">' + esc(desc) + "</p>" : "") +
          "</article></li>";
      })
      .join("");
  }

  function socialLinks() {
    const out = [];
    if (isUsable(D.email)) {
      out.push({ key: "email", url: "mailto:" + D.email, label: "Email", icon: "fa-solid fa-envelope" });
    }
    ["github", "linkedin", "instagram", "tryhackme"].forEach(function (key) {
      if (isUsableUrl(D[key])) {
        out.push({ key: key, url: D[key], label: SOCIAL_META[key].label, icon: SOCIAL_META[key].icon });
      }
    });
    return out;
  }

  function renderContact() {
    const contact = D.contact || {};
    setText("#contactIntro", contact.message);

    const ul = $("#contactList");
    if (!ul) return;
    const rows = [];
    if (isUsable(D.email)) {
      rows.push({ icon: "fa-solid fa-envelope", label: "Email", text: D.email, href: "mailto:" + D.email });
    }
    if (isUsableUrl(D.github)) {
      rows.push({ icon: "fa-brands fa-github", label: "GitHub", text: prettyUrl(D.github), href: D.github });
    }
    if (isUsableUrl(D.linkedin)) {
      rows.push({ icon: "fa-brands fa-linkedin-in", label: "LinkedIn", text: prettyUrl(D.linkedin), href: D.linkedin });
    }
    if (isUsableUrl(D.instagram)) {
      rows.push({ icon: "fa-brands fa-instagram", label: "Instagram", text: prettyUrl(D.instagram), href: D.instagram });
    }
    if (isUsableUrl(D.tryhackme)) {
      rows.push({ icon: "fa-solid fa-flag", label: "TryHackMe", text: prettyUrl(D.tryhackme), href: D.tryhackme });
    }
    ul.innerHTML = rows
      .map(function (r) {
        return '<li class="contact-item reveal"><span class="contact-item__icon"><i class="' + r.icon +
          '" aria-hidden="true"></i></span><div><small>' + r.label + "</small><strong><a href=\"" + esc(r.href) +
          '"' + linkAttrs(r.href) + ">" + esc(r.text) + "</a></strong></div></li>";
      })
      .join("");
  }

  function renderFooter() {
    const social = $("#footerSocial");
    if (social) {
      social.innerHTML = socialLinks()
        .map(function (s) {
          return '<a class="social-btn" href="' + esc(s.url) + '"' + linkAttrs(s.url) + ' aria-label="' +
            esc(s.label) + '" title="' + esc(s.label) + '"><i class="' + s.icon + '" aria-hidden="true"></i></a>';
        })
        .join("");
    }
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ---------- Behaviour ---------- */

  function setupImageFallback() {
    // Capture phase catches image errors from images inserted later by render functions.
    document.addEventListener(
      "error",
      function (e) {
        if (e.target && e.target.tagName === "IMG") e.target.classList.add("is-missing");
      },
      true
    );
    $$("img").forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) img.classList.add("is-missing");
    });
  }

  function runPreloader() {
    const pre = $("#preloader");
    const linesEl = $("#preloaderLines");
    const bar = $("#preloaderBar");
    const pct = $("#preloaderPercent");
    const fast = reducedMotion();

    const finish = function () {
      document.body.classList.add("is-loaded");
      if (pre) {
        pre.classList.add("is-done");
        pre.setAttribute("aria-hidden", "true");
      }
    };
    if (!pre) return finish();

    const delay = fast ? 60 : 380;
    let i = 0;
    const step = function () {
      if (i >= PRELOADER_LINES.length) {
        setTimeout(finish, fast ? 0 : 300);
        return;
      }
      if (linesEl) {
        const row = document.createElement("div");
        row.className = "preloader__line";
        row.textContent = "> " + PRELOADER_LINES[i];
        const ok = document.createElement("span");
        ok.className = "ok";
        ok.textContent = " [OK]";
        row.appendChild(ok);
        linesEl.appendChild(row);
      }
      const p = Math.round(((i + 1) / PRELOADER_LINES.length) * 100);
      if (bar) bar.style.width = p + "%";
      if (pct) pct.textContent = p + "%";
      i += 1;
      setTimeout(step, delay);
    };
    step();
  }

  function setupNav() {
    const nav = $("#navbar, .navbar");
    const toggle = $("#navToggle");
    const menu = $("#navMenu");

    const onScroll = function () {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const setMenu = function (open) {
      if (!menu || !toggle) return;
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        setMenu(!menu.classList.contains("is-open"));
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu && menu.classList.contains("is-open")) {
        setMenu(false);
        if (toggle) toggle.focus();
      }
    });
    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 1024) setMenu(false);
      },
      { passive: true }
    );

    // Smooth in-page navigation with fixed-navbar offset.
    document.addEventListener("click", function (e) {
      const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      const top = window.pageYOffset + target.getBoundingClientRect().top - navHeight();
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion() ? "auto" : "smooth" });
      history.replaceState(null, "", "#" + id);
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.addEventListener("blur", function () { target.removeAttribute("tabindex"); }, { once: true });
      }
      target.focus({ preventScroll: true });
    });

    // Scroll-spy: highlight the link for the section in view.
    const links = $$("#navMenu a[href^='#']");
    const setActive = function (id) {
      links.forEach(function (a) {
        const on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    const sections = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) setActive(en.target.id);
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  function setupContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const statusEl = $("#formStatus");
    const submitBtn = $("#submitBtn");

    const fieldErrors = { fName: "err-name", fEmail: "err-email", fSubject: "err-subject", fMessage: "err-message" };
    const validators = {
      fName: function (v) {
        return !v ? "Please enter your name." : v.length > 60 ? "Name must be 60 characters or fewer." : "";
      },
      fEmail: function (v) {
        if (!v) return "Please enter your email address.";
        if (v.length > 120) return "Email must be 120 characters or fewer.";
        return EMAIL_RE.test(v) ? "" : "Enter a valid email address, for example name@example.com.";
      },
      fSubject: function (v) {
        return !v ? "Please add a subject." : v.length > 120 ? "Subject must be 120 characters or fewer." : "";
      },
      fMessage: function (v) {
        if (!v) return "Please write a message.";
        if (v.length < 10) return "Your message should be at least 10 characters.";
        return v.length > 1500 ? "Message must be 1500 characters or fewer." : "";
      },
    };

    const fieldEl = function (id) { return document.getElementById(id); };
    const errEl = function (id) { return document.getElementById(fieldErrors[id]); };
    const val = function (id) { const el = fieldEl(id); return el ? el.value.trim() : ""; };

    const check = function (id) {
      const input = fieldEl(id);
      if (!input) return true;
      const msg = validators[id](input.value.trim());
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      const err = errEl(id);
      if (err) err.textContent = msg;
      return !msg;
    };

    Object.keys(validators).forEach(function (id) {
      const input = fieldEl(id);
      if (!input) return;
      const err = errEl(id);
      if (err) input.setAttribute("aria-describedby", err.id);
      input.addEventListener("blur", function () { if (input.value.trim()) check(id); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") check(id);
      });
    });

    const setStatus = function (msg, state) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.setAttribute("data-state", state || "");
    };
    const directContact = function () {
      return isUsable(D.email) ? "email " + D.email : "the social links on this page";
    };

    const sendByMail = function (v) {
      if (!isUsable(D.email)) {
        setStatus("Contact email is not configured yet. Please use the social links on this page.", "error");
        return;
      }
      const subject = "[Portfolio] " + v.subject;
      const body = "Name: " + v.name + "\nEmail: " + v.email + "\n\n" + v.message;
      window.location.href = "mailto:" + D.email +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      setStatus("Opening your email app with the message pre-filled. If nothing opens, contact me at " +
        D.email + " directly.", "info");
    };

    const sendToEndpoint = async function (endpoint) {
      const original = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.textContent = "Sending\u2026";
      }
      setStatus("Sending your message\u2026", "");

      const controller = typeof AbortController === "function" ? new AbortController() : null;
      const timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
          signal: controller ? controller.signal : undefined,
        });
        const data = await res.json().catch(function () { return {}; });
        if (!res.ok || data.success === false || data.ok === false) {
          throw new Error("HTTP " + res.status);
        }
        form.reset();
        Object.keys(fieldErrors).forEach(function (id) {
          const el = fieldEl(id);
          if (el) el.setAttribute("aria-invalid", "false");
          const err = errEl(id);
          if (err) err.textContent = "";
        });
        setStatus("Thanks! Your message has been sent.", "success");
      } catch (err) {
        setStatus("Your message could not be sent. Please try again, or contact me via " + directContact() + ".", "error");
      } finally {
        if (timer) clearTimeout(timer);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
          submitBtn.innerHTML = original;
        }
      }
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const honeypot = form.querySelector('input[name="hp_field"]');
      if (honeypot && honeypot.value) return; // Silently ignore bot submissions.

      let firstInvalid = null;
      Object.keys(validators).forEach(function (id) {
        if (!check(id) && !firstInvalid) firstInvalid = fieldEl(id);
      });
      if (firstInvalid) {
        setStatus("Please correct the highlighted fields.", "error");
        firstInvalid.focus();
        return;
      }

      const values = { name: val("fName"), email: val("fEmail"), subject: val("fSubject"), message: val("fMessage") };
      const endpoint = D.contact && D.contact.formEndpoint;
      if (isUsableUrl(endpoint)) sendToEndpoint(endpoint);
      else sendByMail(values);
    });
  }

  /* ---------- Init ---------- */

  function init() {
    checkData();
    const found = warnPlaceholders(D, "", []);
    if (found.length) {
      console.warn("[portfolio] Placeholder text is still in js/data.js. Replace before publishing:\n" + found.join("\n"));
    }

    setupImageFallback();
    try {
      bindText();
      renderHero();
      renderAbout();
      renderStats();
      renderSkills();
      renderProjects();
      renderCertifications();
      bindCertFilters();
      renderTimeline();
      renderContact();
      renderFooter();
      setupNav();
      setupContactForm();
    } catch (err) {
      console.error("[portfolio] Rendering failed:", err);
    }
    runPreloader();
  }

  ready(init);
})();

