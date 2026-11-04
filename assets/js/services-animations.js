
document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Elements that enter from different directions
    const revealGroups = [
        {
            selector: ".ai-hero-content",
            direction: "from-left"
        },
        {
            selector: ".ai-visual",
            direction: "from-right"
        },
        {
            selector: ".ai-intro .ai-section-heading",
            direction: "from-left"
        },
        {
            selector: ".ai-intro .ai-intro-text",
            direction: "from-right"
        },
        {
            selector: ".ai-section-heading.centered",
            direction: "from-top"
        },
        {
            selector: ".ai-card",
            direction: "from-bottom"
        },
        {
            selector: ".enterprise-ai-content",
            direction: "from-left"
        },
        {
            selector: ".enterprise-visual",
            direction: "from-right"
        },
        {
            selector: ".process-card",
            direction: "from-bottom"
        },
        {
            selector: ".ai-final-cta-inner",
            direction: "from-bottom"
        }
    ];

    const elements = [];

    revealGroups.forEach(({ selector, direction }) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            if (elements.some(item => item.element === element)) {
                return;
            }

            element.classList.add("ai-reveal", direction);
            element.style.setProperty(
                "--reveal-delay",
                `${(index % 3) * 120}ms`
            );

            elements.push({ element, direction });
        });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
        elements.forEach(({ element }) => {
            element.classList.add("is-visible");
        });
    } else {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        elements.forEach(({ element }) => observer.observe(element));
    }

    // Floating animation for the glass bars
    const bars = document.querySelectorAll(".ai-glass-bar");

    bars.forEach((bar, index) => {
        bar.style.animationDelay = `${-index * 1.15}s`;
    });

    // Staggered shine effect
    document.querySelectorAll(".bar-shine").forEach((shine, index) => {
        shine.style.animationDelay = `${index * 0.8}s`;
    });
});


/* =====================================
   PRACTICAL AI SCROLL ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const animatedElements = document.querySelectorAll(
        ".practical-section .slide-left, .practical-section .slide-right"
    );

    if (!animatedElements.length) return;

    const animationObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.18
        }
    );

    animatedElements.forEach((element) => {
        animationObserver.observe(element);
    });

});


/* =====================================
   AI CAPABILITY CARDS REVEAL
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".reveal-card");

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
            rootMargin: "0px 0px -40px 0px"
        }
    );

    cards.forEach((card, index) => {
        card.style.setProperty(
            "--card-delay",
            `${index % 3 * 160}ms`
        );

        observer.observe(card);
    });

});