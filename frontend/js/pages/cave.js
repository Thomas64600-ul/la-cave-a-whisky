document.addEventListener("DOMContentLoaded", async () => {
  console.log("Cave → initialisation…");

  initCavePage();
});

function initCavePage() {
  loadCaveWhiskies();
}

async function loadCaveWhiskies() {
  const container = document.getElementById("cave-list");

  if (!container) {
    console.error("Élément #cave-list introuvable.");
    return;
  }

  container.innerHTML = `<div class="loading">Chargement...</div>`;

  try {
    const response = await api.whiskies.getAll();  

    if (!response.success) {
      showError(container, "Erreur lors du chargement des whiskys.");
      return;
    }

    renderWhiskies(container, response.data);

  } catch (err) {
    console.error("Erreur loadCaveWhiskies :", err);
    showError(container, "Impossible de charger les whiskys.");
  }
}

function renderWhiskies(container, whiskies) {
  if (!Array.isArray(whiskies) || whiskies.length === 0) {
    container.innerHTML = `<p class="no-result">Aucun whisky dans la cave.</p>`;
    return;
  }

  container.innerHTML = "";

  whiskies.forEach((whisky) => {
    const html = createCaveCard(whisky); 
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    container.appendChild(div.firstElementChild);
  });
}

function showError(container, message) {
  container.innerHTML = `<p class="error-message">${message}</p>`;
}
