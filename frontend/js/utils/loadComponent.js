window.loadComponent = async function (targetId, filePath) {
  try {
    const container = document.getElementById(targetId);
    if (!container) {
      console.warn(`Élément #${targetId} introuvable.`);
      return;
    }

    if (targetId === "site-header" && container.dataset.loaded === "true") {
      console.warn("Header déjà chargé → pas de rechargement");
      return;
    }

    const res = await fetch(filePath);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – ${filePath}`);
    }

    const html = await res.text();
    container.innerHTML = html;

    container.dataset.loaded = "true";

    if (targetId === "site-header" && window.initThemeSystem) {
      window.initThemeSystem();
    }

  } catch (error) {
    console.error("Erreur lors du chargement du composant :", error);
  }
};
