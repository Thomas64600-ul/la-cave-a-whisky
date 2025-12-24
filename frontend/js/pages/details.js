document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  if (window.initThemeSystem) initThemeSystem();
  if (window.initHeader) initHeader();

  initDetailsPage();
});

function initDetailsPage() {
  const container = document.getElementById("whisky-details");
  if (!container) return;

  container.innerHTML = `<div class="loading">Chargement...</div>`;
  loadWhiskyDetails(container);
}

async function loadWhiskyDetails(container) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const source = params.get("source");

  if (!id) return renderError(container, "Aucun whisky sélectionné.");

  try {
    const whisky = await getWhiskyById(id, source);

    if (!whisky) {
      return renderError(container, "Whisky introuvable.");
    }

    renderDetails(container, whisky);

  } catch (err) {
    console.error("Erreur loadWhiskyDetails :", err);
    renderError(container, "Erreur lors du chargement.");
  }
}

async function getWhiskyById(id, source) {
  console.log("Source détectée :", source);

  try {
    if (source === "catalogue") {
      const r = await api.catalogue.getById(id);
      if (r.success) {
        return { ...r.data, source: "catalogue" };
      }
    }

    const r = await api.whiskies.getById(id);
    if (r.success) {
      return { ...r.data, source: "cave" };
    }

  } catch (err) {
    console.error("Erreur API :", err);
  }

  return null;
}

function renderDetails(container, w) {
  const backURL = w.source === "catalogue"
    ? "api-whiskies.html"
    : "cave.html";

  const tastingAction = isUserLoggedIn()
    ? `
        <a class="btn-primary" href="tasting.html?id=${w._id}">
          Écrire une dégustation →
        </a>
      `
    : `
        <p class="login-hint">
          🔒 Pour écrire une dégustation, veuillez
          <a href="login.html">vous connecter</a> ou
          <a href="register.html">créer un compte</a>.
        </p>
      `;

  container.innerHTML = `
    <div class="details-content">

      <div class="details-image-wrapper">
        <img src="${w.image}" class="details-image" alt="${w.name}">
      </div>

      <div class="details-info">

        <h2>${w.name}</h2>

        <p><strong>Marque :</strong> ${w.brand}</p>
        <p><strong>Pays :</strong> ${w.country}</p>
        <p><strong>Catégorie :</strong> ${w.category}</p>
        <p><strong>Degré :</strong> ${w.degree}%</p>
        <p><strong>Année :</strong> ${w.year ?? "Non renseignée"}</p>

        <div class="details-description">
          ${w.description || "Aucune description disponible."}
        </div>

        <div class="details-buttons">
          <a class="btn-secondary" href="${backURL}">← Retour</a>
          ${tastingAction}
        </div>

      </div>

    </div>
  `;
}


function renderError(container, message) {
  container.innerHTML = `
    <p class="error-message">${message}</p>
  `;
}

function isUserLoggedIn() {
  return !!window.currentUser;
}


