const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const reveals = document.querySelectorAll(".reveal");
const calendlyBox = document.querySelector(".calendly-box");
const counters = document.querySelectorAll(".count-up");

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

const formatFollowerCount = (value) => {
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K+`;
  }

  return `${value}+`;
};

const animateCounter = (counter) => {
  if (counter.dataset.counted === "true") {
    return;
  }

  counter.dataset.counted = "true";

  const target = Number(counter.dataset.target || 0);
  const duration = 1100;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatFollowerCount(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = formatFollowerCount(target);
    }
  };

  requestAnimationFrame(tick);
};

if (counters.length && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}
