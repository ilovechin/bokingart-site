const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const form = document.querySelector("#inquiry-form");
const note = document.querySelector("#form-note");
const animatedSelectors = [
  ".intro-band",
  ".section-heading",
  ".collection-card",
  ".source-card",
  ".universe-tile",
  ".feature-copy",
  ".feature-media",
  ".timeline article",
  ".architecture-grid figure",
  ".about-proof article",
  ".faq-list",
  ".inquiry-copy",
  ".inquiry-form",
  ".metric",
  ".detail-grid",
  ".series-card",
  ".catalog-strip img",
  ".source-panel",
  ".inquiry-mini",
  ".legal-shell",
  ".legal-content section",
];

document.body.classList.add("page-loaded");

const updateHeader = () => {
  header?.setAttribute("data-elevated", String(window.scrollY > 40));
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const closeNavigation = () => {
  document.body.classList.remove("nav-open");
  mainNav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  mainNav?.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeNavigation();
});

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a, .footer-links a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  if (href.startsWith("#")) return;
  const linkPage = href.split("#")[0] || "index.html";
  if (linkPage === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

const revealItems = document.querySelectorAll(animatedSelectors.join(","));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal-ready");
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("revealed"));
}

document.querySelectorAll('a[href]').forEach((link) => {
  const href = link.getAttribute("href") || "";
  const isLocalPage = href.endsWith(".html") || href === "index.html";

  if (!isLocalPage) return;

  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = href;
    }, 180);
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name") || "";
  const email = data.get("email") || "";
  const country = data.get("country") || "";
  const projectType = data.get("projectType") || "";
  const message = data.get("message") || "";

  const subject = encodeURIComponent(`Bokingart project inquiry from ${name}`);
  const body = encodeURIComponent(
    [
      "New Bokingart inquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Country / Region: ${country}`,
      `Project Type: ${projectType}`,
      "",
      "Message:",
      message,
    ].join("\n")
  );

  note.textContent = "Opening your email app with the Bokingart inquiry details.";
  window.location.href = `mailto:contact@bokingart.com?subject=${subject}&body=${body}`;
});
