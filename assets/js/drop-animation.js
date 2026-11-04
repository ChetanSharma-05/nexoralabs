(() => {
  "use strict";

  const selectors = [
    ".service-card",
    ".project-card",
    ".process-card",
    ".principle-card",
    ".value-card",
    ".mission-card",
    ".vision-card"
  ].join(",");

  const cards = document.querySelectorAll(selectors);

  if (!cards.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;

        if (entry.isIntersecting) {
          // Har baar viewport mein aane par animation restart karo
          card.classList.remove("is-dropping");

          // Browser ko class removal apply karne do
          void card.offsetWidth;

          card.classList.add("is-dropping");
        } else {
          // Viewport se bahar jaane par reset karo
          card.classList.remove("is-dropping");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  cards.forEach((card) => observer.observe(card));
})();