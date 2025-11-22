function initThemeSystem() {
  let attempts = 0;

  function tryInit() {
  
    const toggle = document.getElementById("toggle-theme");

    if (!toggle) {
      attempts++;
      if (attempts < 20) {
        return setTimeout(tryInit, 50); 
      }
      console.warn("ThemeSystem: bouton #toggle-theme introuvable.");
      return;
    }

    const currentTheme = localStorage.getItem("theme") || "light";

    if (currentTheme === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark");
      toggle.textContent = "🌙";
    }

    if (toggle.dataset.themeInitialized === "true") {
      return;
    }
    toggle.dataset.themeInitialized = "true";

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      const darkMode = document.body.classList.contains("dark");
      toggle.textContent = darkMode ? "☀️" : "🌙";
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    });

  }

  tryInit();
}

window.initThemeSystem = initThemeSystem;

