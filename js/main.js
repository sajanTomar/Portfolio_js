const header = document.querySelector(".site-header");
const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
const mobileNavigation = document.querySelector("#mobileNavigation");
const mobileOverlay = document.querySelector(".mobile-overlay");
const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-navigation a");
const scrollProgress = document.querySelector(".scroll-progress");
const sections = document.querySelectorAll("main section");
const typingText = document.querySelector("#typingText");
const themeToggle = document.querySelector("#themeToggle");

/* NAVBAR TEXT TYPING & REWRITING EFFECT */
(function initNavbarTextScramble() {
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    if (!navLinks.length) return;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const scrambleSymbols = '░▒▓/_<>[]{}#*+!';

    function lockWidth(link) {
        if (!link.dataset.lockedWidth) {
            const width = link.getBoundingClientRect().width;
            if (width > 0) {
                link.style.minWidth = `${Math.ceil(width)}px`;
                link.dataset.lockedWidth = "true";
            }
        }
    }

    // Pre-lock widths after page load
    window.addEventListener('load', () => {
        navLinks.forEach((link) => lockWidth(link));
    });

    navLinks.forEach((link) => {
        const originalText = link.textContent.trim();
        let timer = null;
        let isHovered = false;

        function playTypingEffect() {
            if (timer) clearInterval(timer);

            let step = 0;
            const totalChars = originalText.length;
            const stepDuration = 65; // Slow, deliberate 65ms per character typing tempo

            timer = setInterval(() => {
                if (!isHovered) {
                    clearInterval(timer);
                    link.textContent = originalText;
                    return;
                }

                if (step <= totalChars) {
                    const revealed = originalText.slice(0, step);
                    let trailing = '';

                    if (step < totalChars) {
                        const symbol = scrambleSymbols[Math.floor(Math.random() * scrambleSymbols.length)];
                        trailing = symbol;
                    }

                    link.textContent = revealed + trailing;
                    step++;
                } else {
                    clearInterval(timer);
                    link.textContent = originalText;
                }
            }, stepDuration);
        }

        link.addEventListener('mouseenter', () => {
            lockWidth(link);
            isHovered = true;
            playTypingEffect();
        });

        link.addEventListener('mouseleave', () => {
            isHovered = false;
            if (timer) clearInterval(timer);
            link.textContent = originalText;
        });
    });
})();

/* =========================================
   HERO CURSOR PARTICLES
   ========================================= */

(function initHeroParticles() {
    const heroStage = document.querySelector(".hero__stage");
    const particleContainer = document.querySelector("#heroParticles");

    if (!heroStage || !particleContainer) return;

    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouchDevice || prefersReducedMotion) return;

    const particleColors = [
        "#3B82F6",
        "#60A5FA",
        "#93C5FD",
        "#A855F7",
        "#6366F1"
    ];

    let lastX = 0;
    let lastY = 0;
    let lastParticleTime = 0;

    heroStage.addEventListener("mousemove", (event) => {
        const currentTime = performance.now();

        if (currentTime - lastParticleTime < 25) {
            return;
        }

        const rect = particleContainer.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const distance = Math.hypot(x - lastX, y - lastY);

        if (distance < 5) {
            return;
        }

        lastX = x;
        lastY = y;
        lastParticleTime = currentTime;

        createParticle(x, y);
    });

    function createParticle(x, y) {
        const particle = document.createElement("span");

        particle.className = "hero-particle";

        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        const size = 4 + Math.random() * 5;
        const duration = 500 + Math.random() * 350;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.color = color;

        particle.style.setProperty(
            "--particle-x",
            `${moveX}px`
        );

        particle.style.setProperty(
            "--particle-y",
            `${moveY}px`
        );

        particle.style.setProperty(
            "--particle-duration",
            `${duration}ms`
        );

        particleContainer.appendChild(particle);

        particle.addEventListener("animationend", () => {
            particle.remove();
        });

        // Fallback cleanup in case animationend event is skipped
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration + 100);
    }
})();

// THEME STUDIO & COLOR PALETTE CUSTOMIZER
(function initThemeStudio() {
    const themeCustomizerBtn = document.querySelector("#themeCustomizerBtn");
    const themeDrawer = document.querySelector("#themeDrawer");
    const themeDrawerOverlay = document.querySelector("#themeDrawerOverlay");
    const themeDrawerCloseBtn = document.querySelector("#themeDrawerCloseBtn");
    const presetButtons = document.querySelectorAll(".theme-preset-btn");
    const modeButtons = document.querySelectorAll(".theme-mode-btn");

    // Default to original dark theme and blue preset
    const savedTheme = localStorage.getItem("theme") || "dark";
    const savedColorPreset = localStorage.getItem("colorPreset") || "blue";

    applyThemeMode(savedTheme);
    applyColorPreset(savedColorPreset);

    function applyThemeMode(mode) {
        if (mode === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "dark");
        }
        updateModeUI(mode === "light" ? "light" : "dark");
    }

    function applyColorPreset(preset) {
        if (preset && preset !== "blue") {
            document.documentElement.setAttribute("data-color", preset);
            localStorage.setItem("colorPreset", preset);
        } else {
            document.documentElement.removeAttribute("data-color");
            localStorage.setItem("colorPreset", "blue");
        }
        updatePresetUI(preset || "blue");
    }

    function updateModeUI(mode) {
        modeButtons.forEach((btn) => {
            if (btn.dataset.mode === mode) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    function updatePresetUI(preset) {
        presetButtons.forEach((btn) => {
            if (btn.dataset.preset === preset) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    function openThemeDrawer() {
        if (!themeDrawer) return;
        themeDrawer.classList.add("active");
        themeDrawerOverlay.classList.add("active");
        themeDrawer.setAttribute("aria-hidden", "false");
    }

    function closeThemeDrawer() {
        if (!themeDrawer) return;
        themeDrawer.classList.remove("active");
        themeDrawerOverlay.classList.remove("active");
        themeDrawer.setAttribute("aria-hidden", "true");
    }

    if (themeCustomizerBtn) {
        themeCustomizerBtn.addEventListener("click", openThemeDrawer);
    }

    if (themeDrawerCloseBtn) {
        themeDrawerCloseBtn.addEventListener("click", closeThemeDrawer);
    }

    if (themeDrawerOverlay) {
        themeDrawerOverlay.addEventListener("click", closeThemeDrawer);
    }

    presetButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const preset = btn.dataset.preset;
            applyColorPreset(preset);
        });
    });

    modeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.mode;
            applyThemeMode(mode);
        });
    });

    // Theme Toggle Header Button sync
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            const nextTheme = isLight ? "dark" : "light";
            applyThemeMode(nextTheme);
        });
    }
})();

// MOBILE NAVIGATION
function openMenu() {
    mobileNavigation.classList.add("active");
    mobileOverlay.classList.add("active");
    mobileMenuBtn.classList.add("active");

    mobileMenuBtn.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";
}

function closeMenu() {
    mobileNavigation.classList.remove("active");
    mobileOverlay.classList.remove("active");
    mobileMenuBtn.classList.remove("active");

    mobileMenuBtn.setAttribute("aria-expanded", "false");

    document.body.style.overflow = "";
}

function toggleMenu() {
    if (mobileNavigation.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }
}

const mobileMenuCloseBtn = document.querySelector("#mobileMenuCloseBtn");

mobileMenuBtn.addEventListener("click", toggleMenu);
mobileOverlay.addEventListener("click", closeMenu);
if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener("click", closeMenu);
}
mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

// ESCAPE KEY
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// HEADER SCROLL STATE
function handleHeader() {
    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

// SCROLL PROGRESS
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    if (documentHeight <= 0) {
        scrollProgress.style.width = "0%";
        return;
    }
    const progress = (scrollTop / documentHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
}

// ACTIVE NAVIGATION
function updateActiveNavigation() {
    let currentSection = "";

    // Check if user has scrolled to the bottom of the page
    const isAtBottom =
        window.innerHeight + Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - 30;

    if (isAtBottom && sections.length > 0) {
        // Automatically highlight the last section (#contact) when scrolled to bottom
        currentSection = sections[sections.length - 1].id;
    } else {
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.offsetHeight;
            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.id;
            }
        });
    }

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

// SMOOTH ANCHOR SCROLLING
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") {
            return;
        }
        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }
        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

// HERO TYPING ANIMATION
const roles = [
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "Web Performance"
];

let roleIndex = 0;
let characterIndex = 0;
let isDeleting = false;

const typingSpeed = 90;
const deletingSpeed = 55;
const pauseAfterTyping = 1400;
const pauseAfterDeleting = 400;

function typeRole() {
    if (!typingText) {
        return;
    }

    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        characterIndex++;
        typingText.textContent = currentRole.slice(0, characterIndex);
        if (characterIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeRole, pauseAfterTyping);
            return;
        }
        setTimeout(typeRole, typingSpeed);
        return;
    }

    characterIndex--;

    typingText.textContent = currentRole.slice(0, characterIndex);

    if (characterIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, pauseAfterDeleting);
        return;
    }
    setTimeout(typeRole, deletingSpeed);
}

// REDUCED MOTION
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (typingText && !prefersReducedMotion) {
    typeRole();
}

// SECTION SCROLL REVEAL (IMPACT CARDS & PRINCIPLES)
function initScrollReveal() {
    const revealSections = document.querySelectorAll(".impact");

    if (!revealSections.length) return;

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealSections.forEach((section) => observer.observe(section));
    } else {
        revealSections.forEach((section) => section.classList.add("is-visible"));
    }
}

const impactSection = document.querySelector("#impact");

function setupImpactReveal() {
    if (!impactSection) {
        return;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        impactSection.classList.add("is-visible");
        return;
    }

    if (!("IntersectionObserver" in window)) {
        impactSection.classList.add("is-visible");
        return;
    }

    const impactObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                startMetricCounters();

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -80px 0px"
        }
    );

    impactObserver.observe(impactSection);
}


/* =========================================================
   IMPACT METRIC COUNTERS
   ========================================================= */

const metricNumbers = document.querySelectorAll(
    ".impact-card__number"
);

function startMetricCounters() {
    if (!metricNumbers.length) {
        return;
    }

    metricNumbers.forEach((metric) => {
        animateMetric(metric);
    });
}

function animateMetric(metric) {
    const target = Number(metric.dataset.target);
    const decimals = Number(metric.dataset.decimals) || 0;

    if (Number.isNaN(target)) {
        return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function updateMetric(currentTime) {
        const elapsedTime = currentTime - startTime;

        const progress = Math.min(
            elapsedTime / duration,
            1
        );

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const currentValue =
            target * easedProgress;

        metric.textContent = currentValue.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(updateMetric);
        } else {
            metric.textContent = target.toFixed(decimals);
        }
    }

    requestAnimationFrame(updateMetric);
}

// SCROLL EVENTS
window.addEventListener("scroll", handleHeader);
window.addEventListener("scroll", updateProgressBar);
window.addEventListener("scroll", updateActiveNavigation);

// INITIAL STATE
// EXPERIENCE SUBCARDS AUTO-SCROLL WITH HOVER PAUSE
function initSubcardAutoScroll() {
    const projectContainers = document.querySelectorAll(".exp-card__projects");

    projectContainers.forEach((container) => {
        const parentCard = container.closest(".exp-card") || container;
        let autoScrollTimer = null;
        let isHovered = false;

        function scrollNext() {
            if (isHovered) return;

            const subcards = container.querySelectorAll(".exp-subcard");
            if (!subcards.length) return;

            const firstCard = subcards[0];
            const gap = 16;
            const stepAmount = firstCard.offsetWidth + gap;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;

            if (container.scrollLeft >= maxScrollLeft - 8) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                container.scrollBy({ left: stepAmount, behavior: "smooth" });
            }
        }

        function startTimer() {
            stopTimer();
            autoScrollTimer = setInterval(scrollNext, 3200);
        }

        function stopTimer() {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
                autoScrollTimer = null;
            }
        }

        // Pause auto scroll on mouseenter anywhere in parent card container
        parentCard.addEventListener("mouseenter", () => {
            isHovered = true;
            stopTimer();
        });

        // Resume auto scroll on mouseleave
        parentCard.addEventListener("mouseleave", () => {
            isHovered = false;
            startTimer();
        });

        // Pause on touch start for mobile
        container.addEventListener("touchstart", () => {
            isHovered = true;
            stopTimer();
        }, { passive: true });

        // Resume after touch interaction
        container.addEventListener("touchend", () => {
            setTimeout(() => {
                isHovered = false;
                startTimer();
            }, 3500);
        }, { passive: true });

        // Start initial auto scroll
        startTimer();
    });
}

// INITIAL STATE
window.addEventListener("load", () => {
    handleHeader();
    updateProgressBar();
    updateActiveNavigation();
    initScrollReveal();
    setupImpactReveal();
    initSubcardAutoScroll();
});

