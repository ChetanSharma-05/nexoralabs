
document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       CURRENT YEAR
    ===================================== */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================
       SCROLL REVEAL ANIMATION
    ===================================== */

    const page = document.querySelector(".contact-page");
    const revealElements = document.querySelectorAll(".contact-reveal");

    if (page && revealElements.length) {

        page.classList.add("contact-js");

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
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });

    }


    /* =====================================
       EMAILJS CONFIGURATION
    ===================================== */
const emailConfig = window.EMAILJS_CONFIG || {};

const EMAILJS_PUBLIC_KEY = emailConfig.PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = emailConfig.SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = emailConfig.TEMPLATE_ID || "";


    /* =====================================
       FORM ELEMENTS
    ===================================== */

    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");

    if (!form || !status || !submitButton) return;


    /* =====================================
       URL SERVICE PRESELECTION
    ===================================== */

    const params = new URLSearchParams(window.location.search);

    const requestedService = params.get("service");
    const requestedProject = params.get("project");

    const serviceSelect = document.getElementById("service");
    const messageField = document.getElementById("message");

    const serviceMap = {
        "software-development": "Custom Software Development",
        "ai-automation": "AI and Automation",
        "web-development": "Web Development",
        "cloud-integration": "Cloud and API Integration",
        "ui-ux-design": "UI/UX Design",
        "maintenance": "Maintenance and Optimization"
    };

    if (requestedService && serviceSelect) {

        const matchingService = serviceMap[requestedService];

        if (matchingService) {
            serviceSelect.value = matchingService;
        }

    }

    if (requestedProject && messageField) {

        const readableProject = requestedProject
            .replace(/-/g, " ")
            .replace(/\b\w/g, character => character.toUpperCase());

        messageField.value =
            `I'm interested in discussing a project similar to ${readableProject}.`;

    }


    /* =====================================
       FORM SUBMISSION
    ===================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        status.className = "form-status";
        status.textContent = "";

        if (!form.reportValidity()) return;

        if (submitButton.disabled) return;

        const configuration = [
            EMAILJS_PUBLIC_KEY,
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID
        ];

        const isConfigured = configuration.every(
            value => value && value.trim().length > 0
        );

        if (!isConfigured) {
            status.classList.add("error");
            status.textContent = "EmailJS configuration is incomplete.";
            return;
        }

        if (!window.emailjs) {
            status.classList.add("error");
            status.textContent =
                "EmailJS could not load. Please refresh the page and try again.";
            return;
        }

        const formData = new FormData(form);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const company = String(formData.get("company") || "").trim();
        const service = String(formData.get("service") || "").trim();
        const budget = String(formData.get("budget") || "").trim();
        const timeline = String(formData.get("timeline") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (name.length < 2 || message.length < 10) {
            status.classList.add("error");
            status.textContent =
                "Please enter a valid name and project description.";
            return;
        }

        const templateParams = {
            title: service,
            name: name,
            email: email,
            company: company || "Not provided",
            service: service,
            budget: budget || "Not specified",
            timeline: timeline || "Not specified",
            message: message
        };

        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");

        const submitText = submitButton.querySelector(".submit-text");

        if (submitText) {
            submitText.textContent = "Sending...";
        }

        status.textContent = "Sending your inquiry...";

        try {

            const response = await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                {
                    publicKey: EMAILJS_PUBLIC_KEY
                }
            );

            if (response.status !== 200) {
                throw new Error("Unexpected EmailJS response.");
            }

            status.className = "form-status success";
            status.textContent =
                "Thank you! Your inquiry has been sent successfully.";

            form.reset();

        } catch (error) {

            console.error("EmailJS submission error:", error);

            status.className = "form-status error";
            status.textContent =
                "Unable to send your inquiry. Please check your EmailJS settings and try again.";

        } finally {

            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");

            if (submitText) {
                submitText.textContent = "Send Inquiry";
            }

        }

    });

});
