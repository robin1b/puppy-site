// -------- Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// -------- Sticky header elevation on scroll
(() => {
  const header = document.querySelector("[data-elevate]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-elevated", window.scrollY > 8);
  };
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

  // Close when clicking a link
  $$(".nav-link", menu).forEach((link) =>
    link.addEventListener("click", closeMenu)
  );

  // Close on outside click
  document.addEventListener("click", (e) => {
    const clickedInside = menu.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeMenu();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

// -------- Smooth scroll (native supported, but keep for older feel)
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
    "#pups",
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
    navLinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === id);
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      setActive("#" + visible.target.id);
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.2, 0.35, 0.5, 0.75] }
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

  let index = 0;

  const slides = Array.from(track.children);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const goTo = (i) => {
    index = clamp(i, 0, slides.length - 1);
    const x = slides[index].offsetLeft;
    track.scrollTo({ left: x, behavior: "smooth" });
  };

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  // Optional: auto-advance
  let timer = setInterval(() => goTo(index + 1), 6500);

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 6500);
  };

  [prev, next, track].forEach((el) =>
    el.addEventListener("pointerdown", resetTimer)
  );

  // If user scrolls manually, update index
  track.addEventListener(
    "scroll",
    () => {
      const left = track.scrollLeft;
      let nearest = 0;
      let best = Infinity;

      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft - left);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });

      index = nearest;
    },
    { passive: true }
  );
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

    note.textContent = `Bedankt ${name || "!"} We hebben je bericht over “${
      topic || "je vraag"
    }” ontvangen (demo).`;
    form.reset();
  });
})();

// -------- Footer year
(() => {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
