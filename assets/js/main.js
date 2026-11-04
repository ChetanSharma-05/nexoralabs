import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

(() => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ========================================
     MOBILE NAVIGATION
  ======================================== */

  const menuToggle = document.querySelector(
    "#nav-toggle, .nav-toggle, .menu-toggle"
  );

  const navLinks = document.querySelector("#primary-nav, .nav-links");

  function closeMenu(returnFocus = false) {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");

    if (returnFocus) {
      menuToggle.focus();
    }
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", navLinks.id || "primary-nav");

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu();
      } else {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        navLinks.classList.add("open");
        document.body.classList.add("nav-open");
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("keydown", (event) => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (event.key === "Escape" && isOpen) {
        closeMenu(true);
      }
    });

    document.addEventListener("click", (event) => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  /* ========================================
     FOOTER YEAR
  ======================================== */

  const currentYear = document.querySelector("#current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ========================================
     SCROLL REVEAL
  ======================================== */

  document.documentElement.classList.add("js-motion");

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* ========================================
     THREE.JS HERO SCENE
  ======================================== */

  const canvas = document.querySelector("#hero-canvas");

  if (!canvas) {
    return;
  }

  const hero = canvas.closest(".hero-visual");

  if (!hero) {
    console.warn(
      "Three.js: #hero-canvas must be inside an element with class .hero-visual."
    );

    return;
  }

  let scene;
  let camera;
  let renderer;

  let sphere;
  let core;
  let particleField;
  let ringGroup;
  let stars;

  let particleGeometry;
  let particleMaterial;
  let starGeometry;
  let starMaterial;

  let resizeObserver;
  let visibilityObserver;
  let animationFrame = null;

  let isVisible = true;
  let isPageVisible = !document.hidden;
  let isDisposed = false;

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  const isMobile = window.matchMedia(
    "(max-width: 760px)"
  ).matches;

  const isSmallScreen = window.matchMedia(
    "(max-width: 430px)"
  ).matches;

  const particleCount = isSmallScreen
    ? 500
    : isMobile
      ? 900
      : 1600;

  const clock = new THREE.Clock();

  /* ========================================
     INITIALIZE SCENE
  ======================================== */

  try {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );

    camera.position.z = 7.5;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "low-power"
    });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio || 1,
        isMobile ? 1.5 : 2
      )
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* MAIN WIREFRAME SPHERE */

    const sphereGeometry = new THREE.IcosahedronGeometry(
      1.48,
      isMobile ? 2 : 3
    );

    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x5cecff,
      wireframe: true,
      transparent: true,
      opacity: 0.23
    });

    sphere = new THREE.Mesh(
      sphereGeometry,
      sphereMaterial
    );

    scene.add(sphere);

    /* INNER CORE */

    const coreGeometry = new THREE.IcosahedronGeometry(
      1.02,
      2
    );

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x7068ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });

    core = new THREE.Mesh(
      coreGeometry,
      coreMaterial
    );

    scene.add(core);

    /* PARTICLE FIELD */

    const particlePositions = new Float32Array(
      particleCount * 3
    );

    const particleColors = new Float32Array(
      particleCount * 3
    );

    const cyan = new THREE.Color(0x61f5ff);
    const purple = new THREE.Color(0x9c7bff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.65 + Math.random() * 1.25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x =
        radius * Math.sin(phi) * Math.cos(theta);

      const y =
        radius * Math.sin(phi) * Math.sin(theta);

      const z = radius * Math.cos(phi);

      const index = i * 3;

      particlePositions[index] = x;
      particlePositions[index + 1] = y;
      particlePositions[index + 2] = z;

      const color = Math.random() > 0.55
        ? cyan
        : purple;

      particleColors[index] = color.r;
      particleColors[index + 1] = color.g;
      particleColors[index + 2] = color.b;
    }

    particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.022 : 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    particleField = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particleField);

    /* ORBIT RINGS */

    ringGroup = new THREE.Group();

    const ringConfigs = [
      {
        radius: 2.05,
        color: 0x61f5ff,
        rotationX: 1.05,
        rotationY: 0.25
      },
      {
        radius: 2.25,
        color: 0x9c7bff,
        rotationX: 1.9,
        rotationY: -0.45
      },
      {
        radius: 1.82,
        color: 0x8dbaff,
        rotationX: 0.45,
        rotationY: 0.9
      }
    ];

    ringConfigs.forEach((config) => {
      const ringGeometry = new THREE.TorusGeometry(
        config.radius,
        0.006,
        8,
        120
      );

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.45
      });

      const ring = new THREE.Mesh(
        ringGeometry,
        ringMaterial
      );

      ring.rotation.x = config.rotationX;
      ring.rotation.y = config.rotationY;

      ringGroup.add(ring);
    });

    scene.add(ringGroup);

    /* BACKGROUND STARS */

    const starCount = isMobile ? 35 : 70;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const index = i * 3;

      starPositions[index] =
        (Math.random() - 0.5) * 9;

      starPositions[index + 1] =
        (Math.random() - 0.5) * 9;

      starPositions[index + 2] =
        -1 - Math.random() * 3;
    }

    starGeometry = new THREE.BufferGeometry();

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    starMaterial = new THREE.PointsMaterial({
      color: 0x9acbff,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });

    stars = new THREE.Points(
      starGeometry,
      starMaterial
    );

    scene.add(stars);

    /* ========================================
       RESIZE HANDLING
    ======================================== */

    function resizeScene() {
      if (
        isDisposed ||
        !renderer ||
        !camera
      ) {
        return;
      }

      const width = Math.max(hero.clientWidth, 1);
      const height = Math.max(hero.clientHeight, 1);

      camera.aspect = width / height;

      camera.position.z =
        width < 450
          ? 8.5
          : width < 760
            ? 8
            : 7.5;

      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);

      if (reducedMotion) {
        renderer.render(scene, camera);
      }
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resizeScene);
      resizeObserver.observe(hero);
    } else {
      window.addEventListener("resize", resizeScene);
    }

    resizeScene();

    /* ========================================
       POINTER INTERACTION
    ======================================== */

    function handlePointerMove(event) {
      if (reducedMotion) return;

      const rect = hero.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      pointerX =
        ((event.clientX - rect.left) / rect.width - 0.5) * 2;

      pointerY =
        ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }

    function resetPointer() {
      pointerX = 0;
      pointerY = 0;
    }

    if (!reducedMotion) {
      hero.addEventListener("pointermove", handlePointerMove);
      hero.addEventListener("pointerleave", resetPointer);
    }

    /* ========================================
       ANIMATION LOOP
    ======================================== */

    function renderScene() {
      animationFrame = null;

      if (
        isDisposed ||
        !renderer ||
        !isVisible ||
        !isPageVisible
      ) {
        return;
      }

      if (!reducedMotion) {
        const elapsed = clock.getElapsedTime();

        targetX +=
          (pointerY * 0.22 - targetX) * 0.035;

        targetY +=
          (pointerX * 0.3 - targetY) * 0.035;

        sphere.rotation.x = elapsed * 0.06 + targetX;
        sphere.rotation.y = elapsed * 0.09 + targetY;

        core.rotation.x = -elapsed * 0.08;
        core.rotation.y = elapsed * 0.1;

        particleField.rotation.y = elapsed * 0.035;
        particleField.rotation.x = targetX * 0.35;

        ringGroup.rotation.y = elapsed * 0.055;
        ringGroup.rotation.x = targetX * 0.2;

        stars.rotation.y = elapsed * 0.008;
      }

      renderer.render(scene, camera);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(renderScene);
      }
    }

    function updateAnimationState() {
      if (isDisposed || !renderer) return;

      const shouldAnimate = isVisible && isPageVisible;

      if (!shouldAnimate) {
        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        return;
      }

      if (reducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderScene);
      }
    }

    /* ========================================
       VISIBILITY OPTIMIZATION
    ======================================== */

    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (isDisposed || !entries.length) return;

          isVisible = entries[0].isIntersecting;
          updateAnimationState();
        },
        {
          threshold: 0.05
        }
      );

      visibilityObserver.observe(hero);
    } else {
      isVisible = true;
    }

    function handleVisibilityChange() {
      isPageVisible = !document.hidden;
      updateAnimationState();
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    /* ========================================
       CLEANUP
    ======================================== */

    function disposeScene() {
      if (isDisposed) return;

      isDisposed = true;

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      if (visibilityObserver) {
        visibilityObserver.disconnect();
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resizeScene);
      }

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", resetPointer);

      if (sphere) {
        sphere.geometry.dispose();
        sphere.material.dispose();
      }

      if (core) {
        core.geometry.dispose();
        core.material.dispose();
      }

      if (particleGeometry) {
        particleGeometry.dispose();
      }

      if (particleMaterial) {
        particleMaterial.dispose();
      }

      if (starGeometry) {
        starGeometry.dispose();
      }

      if (starMaterial) {
        starMaterial.dispose();
      }

      if (ringGroup) {
        ringGroup.children.forEach((ring) => {
          ring.geometry.dispose();
          ring.material.dispose();
        });
      }

      if (renderer) {
        renderer.dispose();
      }
    }

    window.addEventListener("pagehide", disposeScene, {
      once: true
    });

    /* START */

    updateAnimationState();

  } catch (error) {
    console.error(
      "Three.js hero scene could not initialize:",
      error
    );

    if (renderer) {
      renderer.dispose();
    }

    canvas.style.display = "none";

    hero.style.background =
      "radial-gradient(circle, rgba(97,245,255,.12), transparent 70%)";
  }
})();



/* =========================================================
   SCROLL-TRIGGERED ANIMATED STATISTICS
========================================================= */

(() => {
  "use strict";

  const counters = document.querySelectorAll(
    "#company-impact .counter"
  );

  if (!counters.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const setFinalValue = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";

    counter.textContent = target.toLocaleString("en-US") + suffix;
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach(setFinalValue);
    return;
  }

  const animateCounter = (counter) => {
    if (counter.dataset.counted === "true") return;

    counter.dataset.counted = "true";

    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);

      // Ease-out: fast at the start and smooth at the end.
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(target * eased);

      counter.textContent =
        value.toLocaleString("en-US") + (progress === 1 ? suffix : "");

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.4
    }
  );

  counters.forEach((counter) => observer.observe(counter));
})();



/* =====================================
   NEXORA LABS — HOME IMAGE SLIDER
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.querySelector(".home-slider");

    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const dots = slider.querySelectorAll(".dot");
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const counter = slider.querySelector(".current-slide");

    let currentIndex = 0;
    let autoSlide;

    function showSlide(index) {

        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

        if (counter) {
            counter.textContent = String(currentIndex + 1).padStart(2, "0");
        }
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function previousSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlide = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        previousSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    slider.addEventListener("mouseenter", stopAutoSlide);
    slider.addEventListener("mouseleave", startAutoSlide);

    showSlide(0);
    startAutoSlide();

});



/* =====================================
   NAVBAR TRANSPARENT / SCROLL EFFECT
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const header = document.querySelector(".site-header");

    if (!header) return;

    function updateNavbar() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();

});


document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");

    if (!header) return;

    const updateNavbar = () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    };

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();
});



/* =====================================
   HOME SERVICE CARDS — ONE BY ONE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(
        ".home-page .service-grid .service-card"
    );

    if (!cards.length) return;

    const section = document.querySelector("#solutions");
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                observer.unobserve(entry.target);

                cards.forEach((card, index) => {

                    setTimeout(() => {
                        card.classList.add("card-visible");
                    }, index * 800);

                });

            }

        });

    }, {
        threshold: 0.15
    });

    observer.observe(section);

});


/* =====================================
   HOME FEATURES — SCROLL ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const featureRows = document.querySelectorAll(".feature-row");

    if (!featureRows.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.2
    });

    featureRows.forEach((row) => {
        observer.observe(row);
    });

});



/* =========================================
   IMPACT SECTION — SCROLL ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const impactItems = document.querySelectorAll(
        "#company-impact .impact-reveal"
    );

    if (!impactItems.length) return;

    if (!("IntersectionObserver" in window)) {
        impactItems.forEach(item => {
            item.classList.add("impact-visible");
        });
        return;
    }

    const impactObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("impact-visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15
    });

    impactItems.forEach(item => {
        impactObserver.observe(item);
    });

});


/* =================================
   CAPABILITY CARDS SCROLL ANIMATION
================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(
        ".capability-metrics .corner-reveal"
    );

    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15
    });

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 200}ms`;
        observer.observe(card);
    });

});


/* =========================================
   PROJECT CARDS CORNER REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".corner-reveal");

    if (!cards.length) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("corner-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    cards.forEach((card) => {
        observer.observe(card);
    });

});



/* =====================================
   INDUSTRY CARDS SCROLL REVEAL
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const industryCards = document.querySelectorAll(".industry-reveal");

    if (!industryCards.length) return;

    const industryObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("industry-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    industryCards.forEach((card) => {
        industryObserver.observe(card);
    });

});

/* =====================================
   LEFT RIGHT SCROLL ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const animatedBoxes = document.querySelectorAll(
        ".philosophy-section, .cta-section"
    );

    if (!animatedBoxes.length) return;

    const boxObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("slide-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    animatedBoxes.forEach(box => {
        boxObserver.observe(box);
    });

});