/* =========================================================
   js/terminal.js
   Read-only, Kali-style terminal. Predefined commands only.
   Everything runs locally in the browser. Nothing is sent,
   fetched, or executed.
   ========================================================= */
(function () {
  "use strict";

  const PF = window.PF;
  if (!PF) {
    console.error("[portfolio] js/main.js must load before js/terminal.js.");
    return;
  }

  const D = PF.data;
  const T = D.terminal || {};
  const USER = T.user || "sahil";
  const HOST = T.host || "portfolio";
  const CWD = T.cwd || "~";
  const WHOAMI = Array.isArray(T.whoami) ? T.whoami : [];
  const MAX_LINES = 400;
  const COMMAND_NAMES = ["help", "about", "skills", "projects", "contact", "whoami", "clear"];

  const history = [];
  let historyIndex = 0;
  let draft = "";
  let els = null;

  const arr = function (v) { return Array.isArray(v) ? v : []; };
  const skillName = function (it) { return typeof it === "string" ? it : (it && it.name) || ""; };
  // Box-drawing characters written as escapes so the file encoding never matters.
  const promptTop = function () { return "\u250C\u2500\u2500(" + USER + "\u327F" + HOST + ")-[" + CWD + "]"; };
  const promptBottom = "\u2514\u2500$ ";

  function addLine(text, cls) {
    const div = document.createElement("div");
    div.className = "term-line" + (cls ? " " + cls : "");
    div.textContent = text === "" || text === undefined ? "\u00A0" : String(text);
    els.output.appendChild(div);
    return div;
  }

  function addLink(parent, label, href) {
    const a = document.createElement("a");
    a.className = "t-link";
    a.href = href;
    a.textContent = label;
    if (!/^(mailto:|#)/i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    parent.appendChild(a);
  }

  const COMMANDS = {
    help: function () {
      addLine("Available commands:", "t-head");
      [
        ["help", "show this list"],
        ["about", "who I am and what I focus on"],
        ["skills", "skill categories and tools"],
        ["projects", "selected projects"],
        ["contact", "ways to reach me"],
        ["whoami", "a short summary"],
        ["clear", "clear the terminal"],
      ].forEach(function (row) {
        addLine(row[0] + " - " + row[1]);
      });
    },

    about: function () {
      const about = D.about || {};
      addLine(D.fullName || D.name || "", "t-head");
      if (D.title) addLine(D.title);
      if (about.lead) addLine(about.lead);
      addLine("Try 'skills', 'projects', or 'contact'.", "t-muted");
    },

    skills: function () {
      arr(D.skills).forEach(function (cat) {
        addLine(cat.name || cat.title || "", "t-head");
        const names = arr(cat.items).map(skillName).filter(Boolean);
        addLine("  " + names.join(", "));
      });
    },

    projects: function () {
      const list = arr(D.projects);
      if (!list.length) {
        addLine("No projects listed yet.", "t-muted");
        return;
      }
      list.forEach(function (p, i) {
        addLine((i + 1) + ". " + (p.name || "Untitled project"), "t-head");
        const tech = arr(p.tech || p.technologies).join(", ");
        addLine("   " + [p.category, tech].filter(Boolean).join(" | "), "t-muted");
        if (PF.isUsableUrl(p.github)) {
          const row = addLine("   source: ");
          addLink(row, p.github, p.github);
        }
      });
    },

    contact: function () {
      addLine("Contact", "t-head");
      if (PF.isUsable(D.email)) {
        const row = addLine("  email:     ");
        addLink(row, D.email, "mailto:" + D.email);
      }
      [["github", "github:    "], ["linkedin", "linkedin:  "], ["instagram", "instagram: "], ["tryhackme", "tryhackme: "]].forEach(function (pair) {
        const url = D[pair[0]];
        if (PF.isUsableUrl(url)) {
          const row = addLine("  " + pair[1]);
          addLink(row, url, url);
        }
      });
      const form = addLine("  form:      ");
      addLink(form, "Open the contact form", "#contact");
    },

    whoami: function () {
      if (!WHOAMI.length) {
        addLine("No summary configured. Set terminal.whoami in js/data.js.", "t-muted");
        return;
      }
      WHOAMI.forEach(function (l, i) {
        addLine(l, i === 0 ? "t-head" : "");
      });
    },
  };

  function clearOutput() {
    els.output.innerHTML = "";
  }

  function trimOutput() {
    while (els.output.childNodes.length > MAX_LINES) {
      els.output.removeChild(els.output.firstChild);
    }
  }

  function scrollToEnd() {
    els.body.scrollTop = els.body.scrollHeight;
  }

  function run(raw, record) {
    const cmd = String(raw || "").trim();
    addLine(promptTop(), "term-echo-top");
    addLine(promptBottom + cmd, "term-echo");
    if (!cmd) {
      scrollToEnd();
      return;
    }

    if (record !== false) {
      history.push(cmd);
      if (history.length > 50) history.shift();
    }
    historyIndex = history.length;

    const name = cmd.split(/\s+/)[0].toLowerCase();
    if (name === "clear") {
      clearOutput();
      return;
    }
    if (Object.prototype.hasOwnProperty.call(COMMANDS, name)) {
      COMMANDS[name]();
    } else {
      addLine("bash: " + name + ": command not found. Type 'help' for a list of commands.", "t-error");
    }
    trimOutput();
    scrollToEnd();
  }

  function init() {
    els = {
      body: document.getElementById("termBody"),
      output: document.getElementById("termOutput"),
      promptTop: document.getElementById("termPromptTop"),
      form: document.getElementById("termForm"),
      input: document.getElementById("termInput"),
      quick: document.getElementById("termQuick"),
    };
    if (!els.body || !els.output || !els.form || !els.input) return;

    if (els.promptTop) els.promptTop.textContent = promptTop();
    els.input.setAttribute("autocomplete", "off");
    els.input.setAttribute("autocapitalize", "off");
    els.input.setAttribute("spellcheck", "false");

    if (els.quick) {
      els.quick.innerHTML = COMMAND_NAMES
        .map(function (c) {
          return '<button type="button" class="term-chip" data-cmd="' + c + '" aria-label="Run ' + c + '">' + c + "</button>";
        })
        .join("");
    }

    els.form.addEventListener("submit", function (e) {
      e.preventDefault();
      const value = els.input.value;
      els.input.value = "";
      draft = "";
      run(value);
      historyIndex = history.length;
    });

    els.input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!history.length) return;
        if (historyIndex === history.length) draft = els.input.value;
        historyIndex = Math.max(0, historyIndex - 1);
        els.input.value = history[historyIndex];
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex >= history.length) return;
        historyIndex += 1;
        els.input.value = historyIndex === history.length ? draft : history[historyIndex];
      }
    });

    if (els.quick) {
      els.quick.addEventListener("click", function (e) {
        const btn = e.target.closest ? e.target.closest("[data-cmd]") : null;
        if (!btn) return;
        run(btn.getAttribute("data-cmd"));
        els.input.focus();
      });
    }

    // Clicking empty terminal space focuses the input, unless text is being selected.
    els.body.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a, button")) return;
      const selection = window.getSelection ? String(window.getSelection()) : "";
      if (!selection) els.input.focus({ preventScroll: true });
    });

    addLine("Welcome to " + HOST + ". Type 'help' to list commands, or use the buttons below.", "t-muted");
    run("whoami", false);
  }

  PF.ready(init);
})();

