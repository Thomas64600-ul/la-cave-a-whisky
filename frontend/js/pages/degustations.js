document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  if (api?.auth?.check) {
    await api.auth.check();
  }

  if (!isUserLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  if (window.initThemeSystem) initThemeSystem();

  loadAllTastings();
});

async function loadAllTastings() {
  const container = document.getElementById("tastingsList");
  if (!container) return;

  try {
    const res = await api.tastings.getAll();

    if (!res.success || !Array.isArray(res.data)) {
      container.innerHTML = `
        <p class="error-message">Aucune dégustation disponible.</p>
      `;
      return;
    }

    renderTastingCards(container, res.data);

  } catch (err) {
    console.error("Erreur loadAllTastings:", err);
    container.innerHTML = `
      <p class="error-message">Erreur lors du chargement des dégustations.</p>
    `;
  }
}

function renderTastingCards(container, tastings) {
  container.innerHTML = "";

  tastings.forEach(t => {
    const card = document.createElement("div");
    card.className = "tasting-card";

    const img = t.whisky?.image || "../assets/images/default-whisky.jpg";

    card.innerHTML = `
      <img src="${img}" alt="${t.whisky?.name}" class="tasting-img" />

      <div class="tasting-info">
        <h3 class="tasting-whisky-name">${t.whisky?.name}</h3>

        <p class="tasting-rating">
          ★ ${t.rating} — ${t.user?.username ?? "Anonyme"}
        </p>

        <p class="tasting-comment">"${t.comment}"</p>

        <a href="details.html?id=${t.whisky?._id}" class="btn-card">
          Voir le whisky →
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

function isUserLoggedIn() {
  return !!window.currentUser;
}
