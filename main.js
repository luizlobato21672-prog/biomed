"use strict";

/**
 * Descarte Consciente — interações da página
 * Menu mobile, revelação de seções ao rolar, botão "voltar ao topo",
 * barra de progresso de leitura e pequenos efeitos visuais.
 */

document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initScrollReveal();
    initTitleEntrance();
    initCardTilt();

    const backToTop = createBackToTopButton();
    const readingProgress = createReadingProgressBar();
    initScrollWatcher([backToTop.update, readingProgress.update]);
});

// ================================
// MENU MOBILE
// ================================
function initMobileMenu() {
    const nav = document.querySelector("nav");
    const navList = document.querySelector("nav ul");

    if (!nav || !navList) return;

    const menuButton = document.createElement("button");
    menuButton.classList.add("menu-button");
    menuButton.setAttribute("aria-label", "Abrir menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = "☰";
    nav.appendChild(menuButton);

    const setMenuState = (isOpen) => {
        navList.classList.toggle("mobile-menu", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.innerHTML = isOpen ? "✕" : "☰";
    };

    menuButton.addEventListener("click", () => {
        setMenuState(!navList.classList.contains("mobile-menu"));
    });

    // Fecha o menu ao clicar em um link
    navList.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });
}

// ================================
// ANIMAÇÃO AO APARECER NA TELA
// ================================
function initScrollReveal() {
    const REVEAL_THRESHOLD = 0.15;
    const elementos = document.querySelectorAll(
        ".hero-content, .hero-visual, section:not(.hero), .passos article, .info-card, .local-card"
    );

    if (!elementos.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        elementos.forEach((elemento) => elemento.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: REVEAL_THRESHOLD }
    );

    elementos.forEach((elemento) => {
        elemento.classList.add("reveal");
        observer.observe(elemento);
    });
}

// ================================
// BOTÃO VOLTAR AO TOPO
// ================================
function createBackToTopButton() {
    const SHOW_AFTER_PX = 500;

    const topButton = document.createElement("button");
    topButton.classList.add("top-button");
    topButton.innerHTML = "↑";
    topButton.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(topButton);

    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return {
        update: () => topButton.classList.toggle("show", window.scrollY > SHOW_AFTER_PX),
    };
}

// ================================
// EFEITO DE ENTRADA NO TÍTULO
// ================================
function initTitleEntrance() {
    const ENTRANCE_DELAY_MS = 300;
    const titulo = document.querySelector(".hero h1");

    if (!titulo) return;

    titulo.style.opacity = "0";

    window.setTimeout(() => {
        titulo.style.opacity = "1";
        titulo.classList.add("title-animation");
    }, ENTRANCE_DELAY_MS);
}

// ================================
// EFEITO DE INCLINAÇÃO NOS CARDS
// ================================
function initCardTilt() {
    const MAX_TILT_DEG = 3;
    const cards = document.querySelectorAll(".passos article");

    if (!cards.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -MAX_TILT_DEG;
            const rotateY = ((x - centerX) / centerX) * MAX_TILT_DEG;

            card.style.transform = `
                perspective(800px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

// ================================
// BARRA DE PROGRESSO DE LEITURA
// ================================
function createReadingProgressBar() {
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    document.body.appendChild(progressBar);

    return {
        update: () => {
            const alturaTotal =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;

            const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
            progressBar.style.width = `${progresso}%`;
        },
    };
}

// ================================
// LISTENER ÚNICO DE SCROLL
// ================================
// Um único listener de scroll (com requestAnimationFrame) evita múltiplos
// handlers concorrentes e melhora a performance de rolagem.
function initScrollWatcher(callbacks) {
    let ticking = false;

    const onScroll = () => {
        callbacks.forEach((callback) => callback());
        ticking = false;
    };

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(onScroll);
    });

    onScroll();
}
