// Ed's Castle — injects the hero header above Homepage's search/clock bar.
// Edit the CONFIG block to change the text or links.

(function () {
  const CONFIG = {
    eyebrow: "Welcome to",
    title: "Ed's Castle",
    description:
      "Josh's self-hosted homelab: a retired desktop turned Proxmox server that runs my smart home, my network, and the Discord bots and hardware projects I build on the side.",
    rotating: ["proxmox ve", "home assistant", "pi-hole", "discord bots", "esp32 builds", "uptime kuma"],
    links: [
      { label: "GitHub", href: "https://github.com/joshwhite258", icon: "github", primary: true },
      { label: "Homelab repo", href: "https://github.com/joshwhite258/Homelab", icon: "repo" },
    ],
  };

  const ICONS = {
    github:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>',
    repo:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.71 1.71.75.75 0 01-1.07 1.05A2.5 2.5 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.71A2.5 2.5 0 014.5 9h8V1.5zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.09a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>',
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function buildHero() {
    const hero = document.createElement("header");
    hero.id = "ec-hero";
    const links = CONFIG.links
      .map(
        (l) =>
          `<a class="ec-btn${l.primary ? " ec-primary" : ""}" href="${esc(l.href)}" target="_blank" rel="noopener">${ICONS[l.icon] || ""}<span>${esc(l.label)}</span></a>`,
      )
      .join("");
    hero.innerHTML = `
      <div class="ec-eyebrow">${esc(CONFIG.eyebrow)}</div>
      <h1 class="ec-title">${esc(CONFIG.title)}</h1>
      <div class="ec-rule"></div>
      <p class="ec-desc">${esc(CONFIG.description)}</p>
      <div class="ec-term" aria-hidden="true"><span class="ec-prompt">$ running</span><span class="ec-typed"></span><span class="ec-caret">&nbsp;</span></div>
      <nav class="ec-links">${links}</nav>`;
    return hero;
  }

  let typingStarted = false;
  function startTyping() {
    if (typingStarted || !CONFIG.rotating.length) return;
    typingStarted = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let word = 0, char = 0, deleting = false;

    function tick() {
      const el = document.querySelector("#ec-hero .ec-typed");
      if (!el) return setTimeout(tick, 500);
      const current = CONFIG.rotating[word];
      if (reduce) {
        el.textContent = CONFIG.rotating.join(" · ");
        return;
      }
      char += deleting ? -1 : 1;
      el.textContent = current.slice(0, char);
      let delay = deleting ? 45 : 85;
      if (!deleting && char === current.length) { deleting = true; delay = 1600; }
      else if (deleting && char === 0) { deleting = false; word = (word + 1) % CONFIG.rotating.length; delay = 350; }
      setTimeout(tick, delay);
    }
    tick();
  }

  function ensureHero() {
    if (document.getElementById("ec-hero")) return;
    const anchor = document.getElementById("information-widgets");
    if (!anchor || !anchor.parentElement) return;
    anchor.parentElement.insertBefore(buildHero(), anchor);
    startTyping();
  }

  // Bookmarks that point at a Home Assistant webhook (/api/webhook/...) fire it
  // in the background instead of opening a tab, and flash to confirm.
  function flash(a, cls) {
    a.classList.remove("ec-sent", "ec-fail");
    void a.offsetWidth;
    a.classList.add(cls);
    setTimeout(() => a.classList.remove(cls), 1400);
  }
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest(".bookmark > a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href.includes("/api/webhook/")) return;
      e.preventDefault();
      e.stopPropagation();
      fetch(href, { method: "POST", mode: "no-cors" })
        .then(() => flash(a, "ec-sent"))
        .catch(() => flash(a, "ec-fail"));
    },
    true,
  );

  // Homepage is a React app and may re-render; keep the hero in place.
  ensureHero();
  new MutationObserver(ensureHero).observe(document.body, { childList: true, subtree: true });
})();
