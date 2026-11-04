
(() => {
  "use strict";

  const revealElements = document.querySelectorAll(".reveal");

  const floatingElements = document.querySelectorAll(
    ".service-card, .metric-card, .why-card, .industry-card, " +
    ".process-card, .success-card, .philosophy-panel, " +
    ".final-cta-panel, .art-core, .philosophy-core"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Always show content if motion is disabled or observer is unavailable.
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
      element.classList.remove("is-floating");
    });
    return;
  }

  const floatSet = new Set(floatingElements);

  const directions = [
    ["2px", "-5px"],
    ["-3px", "-4px"],
    ["4px", "3px"],
    ["-2px", "5px"],
    ["3px", "-3px"]
  ];

  floatingElements.forEach((element, index) => {
    const direction = directions[index % directions.length];

    element.style.setProperty("--float-x", direction[0]);
    element.style.setProperty("--float-y", direction[1]);
    element.style.setProperty(
      "--float-duration",
      `${4.5 + (index % 4) * 0.6}s`
    );
    element.style.setProperty(
      "--float-delay",
      `${(index % 4) * -0.8}s`
    );
  });

  if (!revealElements.length) return;

  document.documentElement.classList.add("js-reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target;

        if (entry.isIntersecting) {
          element.classList.remove("is-visible", "is-floating");
          void element.offsetWidth;

          element.classList.add("is-visible");

          if (floatSet.has(element)) {
            element.classList.add("is-floating");
          }
        } else {
          element.classList.remove("is-visible", "is-floating");
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));

  const handleMotionChange = (event) => {
    if (!event.matches) return;

    observer.disconnect();
    document.documentElement.classList.remove("js-reveal-ready");

    revealElements.forEach((element) => {
      element.classList.add("is-visible");
      element.classList.remove("is-floating");
      element.style.removeProperty("translate");
    });
  };

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", handleMotionChange);
  } else {
    reducedMotion.addListener(handleMotionChange);
  }
})();
