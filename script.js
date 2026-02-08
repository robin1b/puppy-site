// -------- Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// -------- Sticky header elevation on scroll
(() => {
  const header = document.querySelector("[data-elevate]");
  if (!header) return;

  const onScroll = () =>
    header.classList.toggle("is-elevated", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// -------- Mobile menu toggle
(() => {
  const toggle = $(".nav-toggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav-link", menu).forEach((link) =>
    link.addEventListener("click", closeMenu),
  );

  document.addEventListener("click", (e) => {
    const clickedInside = menu.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

// -------- Smooth scroll
(() => {
  const links = $$('a[href^="#"]');
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

// -------- Active nav link based on scroll position
(() => {
  const sections = [
    "#nestje",
    "#verzorging",
    "#opvang",
    "#over-ons",
    "#reviews",
    "#contact",
  ]
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  const navLinks = $$(".nav-link");

  const setActive = (id) => {
    navLinks.forEach((a) =>
      a.classList.toggle("is-active", a.getAttribute("href") === id),
    );
  };

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      setActive("#" + visible.target.id);
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.2, 0.35, 0.5, 0.75] },
  );

  sections.forEach((sec) => obs.observe(sec));
})();

// -------- Reviews carousel
(() => {
  const car = document.querySelector("[data-carousel]");
  if (!car) return;

  const track = car.querySelector("[data-track]");
  const prev = car.querySelector("[data-prev]");
  const next = car.querySelector("[data-next]");
  if (!track || !prev || !next) return;

  // Alleen echte slides (reviews)
  const slides = Array.from(track.children).filter((el) =>
    el.classList.contains("review"),
  );
  if (!slides.length) return;

  let index = 0;

  // Lees flex-gap uit CSS (werkt met "gap" op flex containers)
  const getGapPx = () => {
    const cs = getComputedStyle(track);
    const gap = cs.gap || cs.columnGap || "0px";
    return Number.parseFloat(gap) || 0;
  };

  // Exacte stap: slide breedte + gap (lost “half slide” bugs op)
  const getStepPx = () => {
    const rect = slides[0].getBoundingClientRect();
    return rect.width + getGapPx();
  };

  // Wrap-around zodat je oneindig kan klikken
  const normalize = (n, len) => ((n % len) + len) % len;

  const goTo = (i) => {
    index = normalize(i, slides.length);
    const left = index * getStepPx();
    track.scrollTo({ left, behavior: "smooth" });
  };

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  // Autoplay blijft (maar gebruikt nu wrap-around + correcte step)
  let timer = setInterval(() => goTo(index + 1), 6500);
  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 6500);
  };
  [prev, next, track].forEach((el) =>
    el.addEventListener("pointerdown", resetTimer),
  );

  // Als je manueel scrolt (touchpad/mobile), index naar dichtste slide zetten
  // requestAnimationFrame voorkomt “spam” tijdens scroll
  let raf = null;
  track.addEventListener(
    "scroll",
    () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = getStepPx();
        if (!step) return;
        index = Math.round(track.scrollLeft / step);
        index = normalize(index, slides.length);
      });
    },
    { passive: true },
  );

  // Belangrijk bij resize: slide breedte verandert => herpositioneer naar huidige index
  window.addEventListener("resize", () => goTo(index));

  // Startpositie
  goTo(0);
})();

// -------- Contact form demo (no backend)
(() => {
  const form = $("#contactForm");
  const note = $("#formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const topic = String(data.get("topic") || "").trim();

    note.textContent = `Bedankt ${
      name || "!"
    } We hebben je bericht over “${topic || "je vraag"}” ontvangen (demo).`;
    form.reset();
  });
})();

// -------- Footer year
(() => {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

// -------- Language switch (demo; later vervangen door CMS)
(() => {
  const buttons = document.querySelectorAll(".lang-btn");
  if (!buttons.length) return;

  // Demo vertalingen (later: laden uit CMS/admin)
  const translations = {
    nl: {
      "cta.book": "Boek afspraak",
      "hero.cta1": "Bekijk aankomend nestje",
      "hero.cta2": "Inschrijven wachtlijst",
      "contact.title": "Contact",
    },
    en: {
      "cta.book": "Book appointment",
      "hero.cta1": "View upcoming litter",
      "hero.cta2": "Join the waitlist",
      "contact.title": "Contact",
    },
    es: {
      "cta.book": "Reservar cita",
      "hero.cta1": "Ver próxima camada",
      "hero.cta2": "Lista de espera",
      "contact.title": "Contacto",
    },
  };

  const applyTranslations = (lang) => {
    const dict = translations[lang];
    if (!dict) return;

    document.documentElement.lang =
      lang === "en" ? "en" : lang === "es" ? "es" : "nl";

    // Update all elements with data-i18n that exist in dict
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
  };

  const setLang = (lang) => {
    localStorage.setItem("lang", lang);
    buttons.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)),
    );
    applyTranslations(lang);
  };

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => setLang(btn.dataset.lang)),
  );
  setLang(localStorage.getItem("lang") || "nl");
})();
