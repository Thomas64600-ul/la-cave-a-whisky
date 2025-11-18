document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-header", "./components/header/header.html");
  await loadComponent("site-footer", "./components/footer/footer.html");

  loadCave();
});

async function loadCave() {
  const container = document.getElementById("cave-list");

  try {
    const result = await api.getWhiskies(); 

    if (!result.success) {
      container.innerHTML = "<p>Erreur lors du chargement.</p>";
      return;
    }

    const whiskies = result.data;
    container.innerHTML = "";

    whiskies.forEach((whisky) => {
      const html = createCaveCard(whisky);  

      const wrap = document.createElement("div");
      wrap.innerHTML = html.trim();

      container.appendChild(wrap.firstElementChild);
    });

  } catch (err) {
    console.error("Erreur cave.js :", err);
    container.innerHTML = "<p>Impossible de charger les whiskys.</p>";
  }
}


