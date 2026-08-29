// ================================
// MENU MOBILE
// ================================

const nav = document.querySelector("nav");
const navList = document.querySelector("nav ul");

const menuButton = document.createElement("button");

menuButton.classList.add("menu-button");
menuButton.setAttribute("aria-label", "Abrir menu");
menuButton.innerHTML = "☰";

nav.appendChild(menuButton);

menuButton.addEventListener("click", () => {
    navList.classList.toggle("mobile-menu");

    if (navList.classList.contains("mobile-menu")) {
        menuButton.innerHTML = "✕";
    } else {
        menuButton.innerHTML = "☰";
    }
});


// Fecha o menu quando clicar em um link

navList.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        navList.classList.remove("mobile-menu");

        menuButton.innerHTML = "☰";

    });

});


// ================================
// ANIMAÇÃO AO APARECER NA TELA
// ================================

const elementos = document.querySelectorAll(
    ".hero-content, .hero-visual, section:not(.hero), .passos article, .info-card, .local-card"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);


elementos.forEach(elemento => {

    elemento.classList.add("reveal");

    observer.observe(elemento);

});


// ================================
// BOTÃO VOLTAR AO TOPO
// ================================

const topButton = document.createElement("button");

topButton.classList.add("top-button");

topButton.innerHTML = "↑";

topButton.setAttribute(
    "aria-label",
    "Voltar ao topo"
);

document.body.appendChild(topButton);


window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.classList.add("show");

    } else {

        topButton.classList.remove("show");

    }

});


topButton.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ================================
// EFEITO DE DIGITAÇÃO NO TÍTULO
// ================================

const titulo = document.querySelector(".hero h1");

if (titulo) {

    const textoOriginal = titulo.innerHTML;

    titulo.style.opacity = "0";

    setTimeout(() => {

        titulo.style.opacity = "1";

        titulo.classList.add("title-animation");

    }, 300);

}


// ================================
// EFEITO NOS CARDS
// ================================

const cards = document.querySelectorAll(".passos article");

cards.forEach(card => {

    card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -3;

        const rotateY =
            ((x - centerX) / centerX) * 3;

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


// ================================
// INDICADOR DE PROGRESSO
// ================================

const progressBar = document.createElement("div");

progressBar.classList.add("progress-bar");

document.body.appendChild(progressBar);


window.addEventListener("scroll", () => {

    const altura =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progresso =
        (window.scrollY / altura) * 100;

    progressBar.style.width = `${progresso}%`;

});