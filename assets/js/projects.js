
document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal elements
  const revealSelectors = [
    ".work-hero-content",
    ".work-hero-visual",
    ".work-section-heading",
    ".work-project-card",

    ".work-principle-item",
    ".work-stack-group",
    ".work-faq details",
    ".work-process-card",
    ".work-cta-content"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(", ")
  );

  revealElements.forEach((element, index) => {
    if (element.classList.contains("work-hero-content")) {
      element.classList.add("work-reveal-left", "is-visible");
      return;
    }

    if (element.classList.contains("work-hero-visual")) {
      element.classList.add("work-reveal-right", "is-visible");
      return;
    }

    element.classList.add("work-reveal");

    // Stagger card animations
    const delay = (index % 4) + 1;
    element.dataset.delay = String(delay);
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    if (
      !element.classList.contains("work-hero-content") &&
      !element.classList.contains("work-hero-visual")
    ) {
      observer.observe(element);
    }
  });

  // Project filters
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".work-project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        const matches = filter === "all" || category === filter;

        card.classList.toggle("is-hidden", !matches);

        if (matches) {
          card.classList.remove("is-visible");
          card.classList.add("is-visible");
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(
        ".work-principles-header, .work-principle"
    );

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-animated");
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
});


/* =========================================
   WORK HERO AUTOMATIC BACKGROUND SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".work-bg-slider");

    if (!slider) return;

    const slides = Array.from(
        slider.querySelectorAll(".work-bg-slide")
    );

    if (slides.length <= 1) return;

    let currentSlide = 0;
    let sliderInterval;

    // First slide active
    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === 0);
    });

    function showNextSlide() {

        slides[currentSlide].classList.remove("active");

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.add("active");
    }

    function startSlider() {
        clearInterval(sliderInterval);

        sliderInterval = setInterval(showNextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(sliderInterval);
    }

    // Start automatic slider
    startSlider();

    // Pause when browser tab is hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }
    });

});


/* =========================================
   PROJECT FOUR-CORNER REVEAL ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".work-project-card");

    if (!cards.length) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        cards.forEach(card => {
            card.classList.add("is-visible");
        });
        return;
    }

    cards.forEach((card, index) => {
        card.classList.add("project-reveal");
        card.style.transitionDelay = `${index * 150}ms`;
    });

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    cards.forEach(card => observer.observe(card));

});



/* ==========================================
   IMPACT ANIMATION ON SCROLL
========================================== */


document.addEventListener("DOMContentLoaded", () => {
    const impactSection = document.querySelector(".impact-section");

    if (!impactSection) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        impactSection.classList.add("is-active");
        return;
    }

    const impactObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    impactSection.classList.add("is-active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    impactObserver.observe(impactSection);
});


/* Capability cards scroll reveal */
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(
        ".work-capabilities .capability-reveal"
    );

    if (!cards.length) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        cards.forEach(card => card.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    cards.forEach(card => observer.observe(card));
});


/* =====================================
   CAPABILITY CARDS - SCROLL ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(
        ".work-capability-card.capability-reveal"
    );

    if (!cards.length) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        cards.forEach(card => card.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.20,
        rootMargin: "0px 0px -50px 0px"
    });

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 100}ms`;
        observer.observe(card);
    });

});


/* ==========================================
   CAPABILITY SECTION SCROLL ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const capabilityCards = document.querySelectorAll(
        ".work-capabilities .capability-reveal"
    );

    if (!capabilityCards.length) return;

    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
    ) {
        capabilityCards.forEach(card => {
            card.classList.add("is-visible");
        });
        return;
    }

    const capabilityObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    capabilityCards.forEach(card => {
        capabilityObserver.observe(card);
    });

});