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

// THEME TOGGLE
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight =
            document.documentElement.getAttribute("data-theme") === "light";
        const nextTheme = isLight ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);
    });
}

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

mobileMenuBtn.addEventListener("click", toggleMenu);
mobileOverlay.addEventListener("click", closeMenu);
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
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.id;
        }
    });

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

// SCROLL EVENTS
window.addEventListener("scroll", handleHeader);
window.addEventListener("scroll", updateProgressBar);
window.addEventListener("scroll", updateActiveNavigation);

// INITIAL STATE
window.addEventListener("load", () => {
    handleHeader();
    updateProgressBar();
    updateActiveNavigation();
});