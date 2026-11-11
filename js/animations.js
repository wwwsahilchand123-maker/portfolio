/* =========================================================
   js/animations.js
   Scroll reveal, counters, skill meters, typing effect,
   particles, parallax, custom cursor (fine pointers only),
   and card spotlight. Effects are skipped or simplified
   when the visitor prefers reduced motion.
   ========================================================= */
(function () {
  "use strict";

  const PF = window.PF;
  if (!PF) {
    console.error("[portfolio] js/main.js must load before js/animations.js.");
    return;
  }

  const $ = PF.$;
  const $$ = PF.$$;
  const D = PF.data;
  const reduce = PF.reducedMotion();
  const canIO = "IntersectionObserver" in window;
  const finePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  function debounce(fn, ms) {
    let t = 0;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (reduce || !canIO) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up statistics ---------- */
  function initCounters() {
    const els = $$(".stat-card__value[data-count]");
    if (!els.length || reduce || !canIO) return; // Final values are already rendered.

    const run = function (el) {
      const end = Number(el.getAttribute("data-count")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1400;
      const start = performance.now();
      const step = function (now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            run(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    els.forEach(function (el) {
      el.textContent = "0" + (el.getAttribute("data-suffix") || "");
      io.observe(el);
    });
  }

  /* ---------- Skill meters (only exist where a level is set in data.js) ---------- */
  function initMeters() {
    const fills = $$(".skill-meter__fill");
    if (!fills.length || reduce || !canIO || !Element.prototype.animate) return;
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          const fill = en.target;
          const width = fill.style.width || "0%";
          fill.animate([{ width: "0%" }, { width: width }], {
            duration: 1100,
            easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
            fill: "backwards",
          });
          io.unobserve(fill);
        });
      },
      { threshold: 0.5 }
    );
    fills.forEach(function (f) { io.observe(f); });
  }

  /* ---------- Typing effect for hero roles ---------- */
  function initTyping() {
    const el = $("#typedRole");
    const roles = D.hero && Array.isArray(D.hero.roles) ? D.hero.roles.filter(Boolean) : [];
    if (!el || !roles.length || reduce) return; // Static roles[0] from main.js remains.

    let r = 0;
    let i = 0;
    let deleting = false;
    el.textContent = "";

    function tick() {
      const word = String(roles[r]);
      if (!deleting) {
        i += 1;
        el.textContent = word.slice(0, i);
        if (i >= word.length) {
          deleting = true;
          return setTimeout(tick, 1800);
        }
        return setTimeout(tick, 70);
      }
      i -= 1;
      el.textContent = word.slice(0, i);
      if (i <= 0) {
        deleting = false;
        r = (r + 1) % roles.length;
        return setTimeout(tick, 400);
      }
      return setTimeout(tick, 35);
    }
    setTimeout(tick, 300);
  }

  /* ---------- Floating particles (canvas, paused when tab is hidden) ---------- */
  function initParticles() {
    const canvas = $("#particles");
    if (!canvas || reduce || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const LINK_DIST = 120;
    let w = 0;
    let h = 0;
    let parts = [];
    let raf = 0;
    let accent = "#E50920";

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || accent;
      const count = Math.min(56, Math.max(14, Math.round((w * h) / 28000)));
      parts = [];
      for (let i = 0; i < count; i += 1) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 0.6 + Math.random() * 1.4,
          a: 0.25 + Math.random() * 0.55,
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      let p;
      for (let i = 0; i < parts.length; i += 1) {
        p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = w + 5;
        else if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        else if (p.y > h + 5) p.y = -5;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = accent;
      for (let i = 0; i < parts.length; i += 1) {
        for (let j = i + 1; j < parts.length; j += 1) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d = dx * dx + dy * dy;
          if (d < LINK_DIST * LINK_DIST) {
            ctx.globalAlpha = (1 - Math.sqrt(d) / LINK_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    size();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", debounce(size, 200), { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    });
  }

  /* ---------- Subtle parallax (uses the CSS translate property so it
     does not overwrite transforms set in the stylesheet) ---------- */
  function initParallax() {
    const els = $$("[data-parallax]");
    if (!els.length || reduce) return;
    let ticking = false;
    function update() {
      ticking = false;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.5) return;
      els.forEach(function (el) {
        const factor = parseFloat(el.getAttribute("data-parallax")) || 0;
        el.style.translate = "0 " + (y * factor).toFixed(1) + "px";
      });
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Custom cursor (desktop with a fine pointer only) ----------
     Assumes the .cursor-dot and .cursor-ring elements are centred with
     CSS transform: translate(-50%, -50%), as in animations.css. */
  function initCursor() {
    if (reduce || !finePointer) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");

    const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], .filter-btn";
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const show = function (on) {
      dot.style.opacity = on ? "1" : "0";
      ring.style.opacity = on ? "1" : "0";
    };
    show(false);

    function loop() {
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      ring.style.translate = rx + "px " + ry + "px";
      raf = Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    }

    window.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType === "touch") return;
        mx = e.clientX;
        my = e.clientY;
        dot.style.translate = mx + "px " + my + "px";
        show(true);
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true }
    );

    document.addEventListener("pointerover", function (e) {
      const hit = e.target && e.target.closest ? e.target.closest(INTERACTIVE) : null;
      ring.classList.toggle("is-hover", !!hit);
    });

    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget) show(false);
    });
    window.addEventListener("blur", function () { show(false); });
  }

  /* ---------- Card spotlight (cursor-follow glow via --mx / --my) ---------- */
  function initSpotlight() {
    document.addEventListener(
      "pointermove",
      function (e) {
        const card = e.target && e.target.closest ? e.target.closest(".spotlight") : null;
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      },
      { passive: true }
    );
  }

  PF.ready(function () {
    initReveal();
    initCounters();
    initMeters();
    initTyping();
    initParticles();
    initParallax();
    initCursor();
    initSpotlight();
  });
})();

