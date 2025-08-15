// script.js
document.addEventListener("DOMContentLoaded", () => {
  // ----- Footer year (works on every page) -----
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Theme toggle (persisted in localStorage) -----
  const toggleBtn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let theme = saved || (prefersDark ? "dark" : "light");

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  applyTheme();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", theme);
      applyTheme();
    });
  }

  // ----- Back to top button -----
  const btt = document.getElementById("backToTop");
  function onScroll() {
    if (!btt) return;
    if (window.scrollY > 400) btt.classList.add("show");
    else btt.classList.remove("show");
  }
  window.addEventListener("scroll", onScroll);
  if (btt) btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ----- Contact form helpers -----
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("message");
  const counter = document.getElementById("msgCount");
  const statusEl = document.getElementById("form-status");

  if (msg && counter) {
    msg.maxLength = 500;
    const update = () => (counter.textContent = String(msg.value.length));
    msg.addEventListener("input", update);
    update();
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      // simple check so users write something meaningful
      if (msg && msg.value.trim().length < 10) {
        e.preventDefault();
        alert("Please write at least 10 characters.");
        msg.focus();
        return;
      }

      // If you’re using Formspree, handle via fetch for a nice UX
      if (form.action.startsWith("https://formspree.io/")) {
        e.preventDefault();
        if (statusEl) statusEl.textContent = "Sending…";
        try {
          const res = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            if (statusEl) statusEl.textContent = "Thanks! I will reply soon.";
            form.reset();
            if (counter) counter.textContent = "0";
          } else {
            if (statusEl) statusEl.textContent = "Oops, something went wrong.";
          }
        } catch {
          if (statusEl) statusEl.textContent = "Network error. Please try later.";
        }
      }
      // else: on GitHub Pages without Formspree, normal POST won’t work (405)
    });
  }
});
