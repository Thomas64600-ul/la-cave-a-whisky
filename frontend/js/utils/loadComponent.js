window.loadComponent = async function (targetId, filePath) {
  try {
    const container = document.getElementById(targetId);
    if (!container) {
      console.warn(`Élément #${targetId} introuvable.`);
      return;
    }

    let url = filePath;

    if (!filePath.startsWith("/")) {
      const base = window.location.origin;
      url = base + "/" + filePath.replace(/^(\.\/|\.{2}\/)+/, "");
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – Impossible de charger ${url}`);
    }

    const html = await res.text();
    container.innerHTML = html;

    if (targetId === "site-header") {
      if (window.initThemeSystem) window.initThemeSystem();
      if (window.initHeader) window.initHeader();
    }

  } catch (error) {
    console.error("Erreur loadComponent :", error);
  }
};
