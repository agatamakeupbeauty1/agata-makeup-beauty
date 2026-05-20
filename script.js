const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const reveals = document.querySelectorAll(".reveal");
const calendlyBox = document.querySelector(".calendly-box");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("active"));
}

if (calendlyBox) {
  const markCalendlyLoaded = () => {
    const iframe = calendlyBox.querySelector("iframe");

    if (iframe) {
      iframe.addEventListener("load", () => {
        calendlyBox.classList.add("calendly-loaded");
      }, { once: true });

      window.setTimeout(() => {
        calendlyBox.classList.add("calendly-loaded");
      }, 2500);

      return true;
    }

    return false;
  };

  if (!markCalendlyLoaded() && "MutationObserver" in window) {
    const calendlyObserver = new MutationObserver(() => {
      if (markCalendlyLoaded()) {
        calendlyObserver.disconnect();
      }
    });

    calendlyObserver.observe(calendlyBox, { childList: true, subtree: true });
  }
}
