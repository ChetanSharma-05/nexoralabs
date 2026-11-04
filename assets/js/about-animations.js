
document.addEventListener("DOMContentLoaded", () => {

    const page = document.querySelector(".about-page");

    if (!page) return;

    page.classList.add("about-js");

    const elements = page.querySelectorAll(".about-reveal");

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observerInstance.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });

    // Footer current year
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});
