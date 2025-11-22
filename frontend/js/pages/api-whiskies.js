document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  initAPIWhiskiesPage();
});

async function initAPIWhiskiesPage() {
  const container = document.getElementById("api-whisky-list");
  const actionsBox = document.getElementById("api-actions");

  if (!container) {
    console.error("Élément #api-whisky-list introuvable.");
    return;
  }

  container.innerHTML = `<div class="loading">Chargement...</div>`;

  await initCatalogueActions(actionsBox);

  loadAPIWhiskies(container);
}

async function initCatalogueActions(box) {
  if (!box) return;

  try {
    const { success, user } = await api.auth.check();

    if (!success || !user) {
      box.innerHTML = `
        <p class="catalogue-message">
          Vous souhaitez enrichir le catalogue ?<br>
          <a class="link-btn" href="login.html#login">Connexion</a> • 
          <a class="link-btn" href="login.html#register">Inscription</a>
        </p>
      `;
      return;
    }

    box.innerHTML = `
      <button id="btn-add-whisky-catalogue" class="btn-add-whisky">
        ➕ Ajouter un whisky
      </button>
    `;

    document
      .getElementById("btn-add-whisky-catalogue")
      .addEventListener("click", () => {
        window.location.href = "add-whisky.html";
      });

  } catch (error) {
    console.error("Erreur affichage actions catalogue :", error);
  }
}

async function loadAPIWhiskies(container) {
  try {
    const result = await api.catalogue.getAll();

    if (!result.success || !Array.isArray(result.data)) {
      showError(container, "Erreur lors du chargement de l’API mondiale.");
      return;
    }

    renderCatalogue(container, result.data);

  } catch (error) {
    console.error("Erreur loadAPIWhiskies :", error);
    showError(container, "Impossible de charger les whiskys du catalogue.");
  }
}

function renderCatalogue(container, whiskies) {
  if (whiskies.length === 0) {
    container.innerHTML = `<p class="no-result">Aucun whisky dans le catalogue mondial.</p>`;
    return;
  }

  container.innerHTML = ""; 

  whiskies.forEach((whisky) => {
    const html = createCatalogueCard(whisky);
    const wrapper = document.createElement("div");

    wrapper.innerHTML = html.trim();
    container.appendChild(wrapper.firstElementChild);
  });
}

function showError(container, message) {
  container.innerHTML = `
    <p class="error-message">${message}</p>
  `;
}





