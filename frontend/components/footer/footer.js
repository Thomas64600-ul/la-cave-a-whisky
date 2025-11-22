document.addEventListener("DOMContentLoaded", () => {
  initFooter();
});

function initFooter() {
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
