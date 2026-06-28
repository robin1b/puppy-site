const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

(() => {
  const header = $("[data-header]");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("is-elevated", window.scrollY > 45);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();

(() => {
  const button = $(".dropdown-toggle");
  const menu = $(".dropdown-menu");

  if (!button || !menu) return;

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menu.classList.toggle("is-open");
    button.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      button.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!button.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.remove("is-open");
      button.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }
  });
})();

(() => {
  const quote = $("#heroQuote");
  if (!quote) return;

  const quotes = [
    "DoodleStars - 100% Australian Labradoodle, 100% onweerstaanbaar",
    "Geboren uit liefde, opgegroeid in de huiskamer, klaar om jouw hart te stelen",
    "Geen betere therapeut dan een pluche vriend met 4 pootjes",
    "Dikke knuffels, zachte vacht en een heleboel kwispelplezier",
    "Australian Labradoodles: een brok geluk in een jasje van wol",
    "Zacht van vacht, puur van karakter",
  ];

  let index = 0;

  setInterval(() => {
    quote.style.opacity = "0";

    setTimeout(() => {
      index = (index + 1) % quotes.length;
      quote.textContent = quotes[index];
      quote.style.opacity = "1";
    }, 400);
  }, 4500);
})();

(() => {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

(() => {
  const form = $("#contactForm");
  const note = $("#formNote");

  if (!form || !note) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();

    note.textContent = `Bedankt ${name || ""}. Je bericht is ontvangen. We nemen zo snel mogelijk contact op.`;
    form.reset();
  });
})();

(() => {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
