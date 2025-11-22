document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
});

function initHomePage() {
  const container = document.getElementById("home-whisky-list");
  if (!container) return;

  container.innerHTML = `<div class="loading">Chargement...</div>`;
  loadDailyWhiskies(container);
}

async function loadDailyWhiskies(container) {
  try {
    console.log("Chargement API catalogue…");

    const result = await api.catalogue.getAll();
    const whiskies = result.data ?? [];

    const selection = [...whiskies]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    renderSelection(container, selection);

  } catch (e) {
    console.error("Erreur sélection du jour :", e);
    container.innerHTML = `<p class="error-message">Impossible de charger.</p>`;
  }
}

function renderSelection(container, whiskies) {
  container.innerHTML = "";

  whiskies.forEach(w => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = createWhiskyCard(w);
    container.appendChild(wrapper.firstElementChild);
  });
}
