const header = document.querySelector(".site-header");
const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
const mobileNavigation = document.querySelector("#mobileNavigation");
const mobileOverlay = document.querySelector(".mobile-overlay");
const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-navigation a");
const scrollProgress = document.querySelector(".scroll-progress");

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

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

function handleHeader() {
    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleHeader);

function updateProgressBar() {
    const scrollTop = window.scrollY;
    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const progress = (scrollTop / documentHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar);
const sections = document.querySelectorAll("main section");

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

window.addEventListener("scroll", updateActiveNavigation);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

window.addEventListener("load", () => {
    handleHeader();
    updateProgressBar();
    updateActiveNavigation();
});