(() => {
  const config = window.PORTFOLIO_CONFIG || {};

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[char]);

  function injectNav() {
    const currentPage = document.body.dataset.page || "";
    document.querySelectorAll("[data-site-nav]").forEach((host) => {
      host.className = "site-nav";
      host.setAttribute("aria-label", "Primary navigation");
      host.innerHTML = `
        <nav class="site-nav__group" aria-label="Portfolio">
          <a href="index.html" class="ui-link" data-nav="home">Home</a>
          <a href="about.html" class="ui-link" data-nav="about">About</a>
          <a href="work.html" class="ui-link" data-nav="work">Work</a>
          <a href="experience.html" class="ui-link" data-nav="experience">Experience</a>
        </nav>
        <a href="index.html" class="site-nav__wordmark" aria-label="${escapeHtml(config.name)} home">${escapeHtml(config.initials || "YN")}</a>
        <nav class="site-nav__group site-nav__group--right" aria-label="Connect">
          <a href="notes.html" class="ui-link" data-nav="notes">Notes</a>
          <a href="${escapeHtml(config.instagramHref)}" class="ui-link" target="_blank" rel="noreferrer">${escapeHtml(config.instagramLabel)}</a>
          <a href="contact.html" class="ui-link" data-nav="contact">Contact</a>
        </nav>`;
      const active = host.querySelector(`[data-nav="${CSS.escape(currentPage)}"]`);
      if (active) active.setAttribute("aria-current", "page");
    });
  }

  function injectFooter() {
    document.querySelectorAll("[data-site-footer]").forEach((host) => {
      const fixed = host.hasAttribute("data-fixed-footer");
      host.className = `site-footer${fixed ? " site-footer--fixed" : ""}`;
      host.innerHTML = `
        <nav class="site-footer__links" aria-label="Footer navigation">
          <a href="work.html" class="ui-link">Selected Work</a>
          <a href="about.html" class="ui-link">About</a>
          <a href="experience.html" class="ui-link">Experience</a>
          <a href="notes.html" class="ui-link">Notes</a>
          <a href="contact.html" class="ui-link">Contact</a>
        </nav>
        <span class="visitor-count">${escapeHtml(config.availability || "Available for selected collaborations")}</span>`;
    });
  }

  function injectEmblems() {
    const safeName = escapeHtml(String(config.name || "YOUR NAME").toUpperCase());
    const safeYear = escapeHtml(config.foundedYear || "2026");
    const safeInitials = escapeHtml(config.initials || "YN");
    document.querySelectorAll("[data-emblem]").forEach((host, index) => {
      const pathTop = `emblemPathTop-${index}`;
      const pathBottom = `emblemPathBottom-${index}`;
      host.innerHTML = `
        <svg class="emblem" viewBox="0 0 240 240" role="presentation" focusable="false">
          <defs>
            <path id="${pathTop}" d="M 33,120 a 87,87 0 1,1 174,0"></path>
            <path id="${pathBottom}" d="M 207,120 a 87,87 0 1,1 -174,0"></path>
          </defs>
          <circle cx="120" cy="120" r="101"></circle>
          <circle cx="120" cy="120" r="92"></circle>
          <circle cx="120" cy="120" r="62"></circle>
          <g class="emblem-rotor">
            <text class="emblem-text"><textPath href="#${pathTop}" startOffset="50%" text-anchor="middle">${safeName} · PORTFOLIO · ${safeYear} ·</textPath></text>
            <text class="emblem-text"><textPath href="#${pathBottom}" startOffset="50%" text-anchor="middle">SELECTED WORK · NOTES · PRACTICE ·</textPath></text>
          </g>
          <path d="M96 120h48M120 96v48" class="emblem-cross"></path>
          <circle cx="120" cy="120" r="27" class="emblem-inner"></circle>
          <text x="120" y="126" text-anchor="middle" class="emblem-initials">${safeInitials}</text>
          <path d="M120 44v9M120 187v9M44 120h9M187 120h9"></path>
        </svg>`;
    });
  }

  function applyConfig() {
    document.querySelectorAll("[data-config]").forEach((node) => {
      const key = node.getAttribute("data-config");
      if (key in config) node.textContent = config[key];
    });

    document.querySelectorAll("[data-config-href]").forEach((node) => {
      const key = node.getAttribute("data-config-href");
      if (key in config) node.setAttribute("href", config[key]);
    });

    document.querySelectorAll("[data-mailto]").forEach((node) => {
      node.setAttribute("href", `mailto:${config.email}`);
    });

    const statement = document.querySelector("[data-home-statement]");
    if (statement) {
      statement.innerHTML = `${escapeHtml(config.statementLead)} <a class="text-link" href="work.html">${escapeHtml(config.discipline)}</a>.`;
    }
  }

  function setupEmblemMotion() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    document.querySelectorAll(".emblem-wrap").forEach((el) => {
      el.addEventListener("pointermove", (event) => {
        if (prefersReduced.matches || coarsePointer.matches) return;
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--rx", `${y * -2}deg`);
        el.style.setProperty("--ry", `${x * 2}deg`);
        el.style.setProperty("--tx", `${x * 2}px`);
        el.style.setProperty("--ty", `${y * 2}px`);
      });
      el.addEventListener("pointerleave", () => {
        ["--rx", "--ry"].forEach((p) => el.style.setProperty(p, "0deg"));
        ["--tx", "--ty"].forEach((p) => el.style.setProperty(p, "0px"));
      });
    });
  }

  function setupDemoForms() {
    document.querySelectorAll("[data-demo-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const status = form.querySelector("[data-form-status]");
        if (status) status.textContent = "Demo form — connect this to Formspree, Netlify Forms, or your preferred service before publishing.";
      });
    });
  }

  function updateTitle() {
    const pageTitle = document.body.dataset.title;
    const name = config.name || "YOUR NAME";
    document.title = pageTitle ? `${pageTitle} — ${name}` : name;
  }

  injectNav();
  injectFooter();
  injectEmblems();
  applyConfig();
  setupEmblemMotion();
  setupDemoForms();
  updateTitle();
})();
