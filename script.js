/* =========================================================
   FARLANDSTECH — JavaScript
   Most personal edits live in the LINKS array below.
   ========================================================= */

/* =========================================================
   1. EDIT YOUR LINKS HERE
   Change url, title, subtitle and icon for each button.
   ========================================================= */
const LINKS = [
  {
    title: "TikTok",
    subtitle: "@farlandstech",
    url: "https://www.tiktok.com/@farlandstech",
    icon: "♪"
  },
  {
    title: "Instagram",
    subtitle: "Photos, phones & behind the scenes",
    url: "https://www.instagram.com/",
    icon: "◎"
  },
  {
    title: "YouTube",
    subtitle: "Longer videos & tech content",
    url: "https://www.youtube.com/",
    icon: "▶"
  },
  {
    title: "Business / Collaborations",
    subtitle: "Work with FarlandsTech",
    url: "mailto:YOUR-EMAIL@example.com",
    icon: "✦"
  },
  {
    title: "My Vinted",
    subtitle: "Phones, tech & other finds",
    url: "https://www.vinted.nl/",
    icon: "V"
  },
  {
    title: "Contact",
    subtitle: "Send me an email",
    url: "mailto:YOUR-EMAIL@example.com",
    icon: "✉"
  }
];

/* Render the link cards */
const linksContainer = document.querySelector("#links");

LINKS.forEach((link, index) => {
  const card = document.createElement("a");
  card.className = "link-card reveal";
  card.href = link.url;
  card.target = link.url.startsWith("mailto:") ? "_self" : "_blank";
  card.rel = link.url.startsWith("mailto:") ? "" : "noopener noreferrer";
  card.style.transitionDelay = `${Math.min(index * 55, 250)}ms`;

  card.innerHTML = `
    <span class="link-icon" aria-hidden="true">${link.icon}</span>
    <span class="link-copy">
      <span class="link-title">${link.title}</span>
      <span class="link-subtitle">${link.subtitle}</span>
    </span>
    <span class="link-arrow" aria-hidden="true">›</span>
  `;

  linksContainer.appendChild(card);
});

/* Reveal elements as they enter the viewport */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: "0px 0px -35px 0px"
});

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* Pointer-following glow for glass cards */
document.addEventListener("pointermove", (event) => {
  const card = event.target.closest(".link-card");
  if (!card) return;

  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
});

/* Touch feedback */
document.addEventListener("pointerdown", (event) => {
  const card = event.target.closest(".link-card");
  if (!card) return;

  card.classList.add("is-pressed");
  window.setTimeout(() => card.classList.remove("is-pressed"), 180);
});

/* Lightweight phone parallax.
   The transforms preserve each phone's base rotation while adding movement. */
const phones = [...document.querySelectorAll(".phone")];
let scrollY = window.scrollY;
let targetScroll = scrollY;
let ticking = false;

window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

function updateParallax() {
  scrollY += (targetScroll - scrollY) * 0.12;

  phones.forEach((phone, index) => {
    const speed = 0.025 + (index % 4) * 0.009;
    const drift = Math.sin((scrollY * 0.002) + index) * 4;
    const rotation = [ -14, 13, 9, -11, 17, -18, -6, 7 ][index] || 0;

    phone.style.transform =
      `translate3d(${drift}px, ${scrollY * speed}px, 0) rotate(${rotation}deg)`;
  });

  document.querySelector(".ambient-a").style.transform =
    `translate3d(0, ${scrollY * -0.035}px, 0)`;
  document.querySelector(".ambient-b").style.transform =
    `translate3d(0, ${scrollY * 0.025}px, 0)`;
  document.querySelector(".ambient-c").style.transform =
    `translate3d(0, ${scrollY * -0.02}px, 0)`;

  if (Math.abs(targetScroll - scrollY) > 0.5) {
    requestAnimationFrame(updateParallax);
  } else {
    ticking = false;
  }
}

/* Current year */
document.querySelector("#year").textContent = new Date().getFullYear();
