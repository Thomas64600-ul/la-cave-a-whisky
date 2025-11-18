document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-header", "./components/header/header.html");
  await loadComponent("site-footer", "./components/footer/footer.html");

  loadDailyWhiskies();
});

async function loadDailyWhiskies() {
  const container = document.getElementById("home-whisky-list");

  try {
    const res = await fetch("http://localhost:5000/api/catalogue");
    const result = await res.json();

    if (!result.success) {
      container.innerHTML = "<p>Erreur lors du chargement.</p>";
      return;
    }

    const shuffled = result.data.sort(() => Math.random() - 0.5);

    
    const selection = shuffled.slice(0, 8);

    container.innerHTML = "";

    selection.forEach((whisky) => {
      const html = createWhiskyCard(whisky); 
      const wrap = document.createElement("div");
      wrap.innerHTML = html.trim();
      container.appendChild(wrap.firstElementChild);
    });

  } catch (error) {
    console.error("Erreur sélection du jour :", error);
    container.innerHTML = "<p>Impossible de charger la sélection.</p>";
  }
}




