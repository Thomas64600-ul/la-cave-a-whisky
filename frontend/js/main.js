import { loadComponent } from "./utils/loadComponent.js";

document.addEventListener("DOMContentLoaded", async () => {
 
  await loadComponent("header", "./components/header/header.html");
  await loadComponent("footer", "./components/footer/footer.html");

  const toggle = document.getElementById("toggle-theme");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      toggle.textContent = document.body.classList.contains("dark")
        ? "☀️"
        : "🌙";
    });
  }
});
