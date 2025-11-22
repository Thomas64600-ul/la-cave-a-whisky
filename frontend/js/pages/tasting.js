document.addEventListener("DOMContentLoaded", async () => {
 
  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  if (window.initThemeSystem) initThemeSystem();

  initTastingPage();
});

function initTastingPage() {
  const params = new URLSearchParams(window.location.search);
  const whiskyId = params.get("id");

  const title = document.getElementById("whiskyName");
  const form = document.getElementById("tastingForm");
  const backBtn = document.getElementById("backDetailBtn");

  if (!whiskyId) {
    title.textContent = "Aucun whisky sélectionné.";
    return;
  }

  backBtn.href = `details.html?id=${whiskyId}`;

  loadWhiskyInfo(whiskyId);
  loadTastingList(whiskyId);

  form.addEventListener("submit", (e) =>
    handleTastingSubmit(e, whiskyId)
  );
}

async function loadWhiskyInfo(whiskyId) {
  const title = document.getElementById("whiskyName");

  try {
    const res = await fetch(`http://localhost:5000/api/whiskies/${whiskyId}`);
    const data = await res.json();

    if (!data.success) {
      title.textContent = "Whisky introuvable.";
      return;
    }

    title.textContent = `${data.data.name} — Dégustations`;

  } catch (err) {
    console.error("Erreur loadWhiskyInfo:", err);
    title.textContent = "Erreur lors du chargement du whisky.";
  }
}

async function loadTastingList(whiskyId) {
  const list = document.getElementById("tastingList");
  list.innerHTML = `<div class="loading">Chargement...</div>`;

  try {
    const res = await fetch(`http://localhost:5000/api/tastings/whisky/${whiskyId}`);
    const result = await res.json();

    if (!result.success || !Array.isArray(result.data)) {
      list.innerHTML = `<p class="error-message">Aucun avis pour le moment.</p>`;
      return;
    }

    renderTastings(list, result.data);

  } catch (error) {
    console.error("Erreur loadTastingList:", error);
    list.innerHTML = `<p class="error-message">Impossible de charger les avis.</p>`;
  }
}

function renderTastings(container, tastings) {
  if (tastings.length === 0) {
    container.innerHTML = `<p class="no-result">Aucun avis pour ce whisky.</p>`;
    return;
  }

  container.innerHTML = "";

  tastings.forEach((t) => {
    const card = document.createElement("div");
    card.className = "tasting-card";

    card.innerHTML = `
      <strong>${t.user?.username ?? "Anonyme"} — ★ ${t.rating}</strong>
      <p>${t.comment}</p>
    `;

    container.appendChild(card);
  });
}

async function handleTastingSubmit(e, whiskyId) {
  e.preventDefault();

  const rating = Number(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();

  if (!rating || !comment) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/tastings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whisky: whiskyId, rating, comment }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "Erreur serveur.");
      return;
    }

    document.getElementById("tastingForm").reset();

    loadTastingList(whiskyId);

  } catch (err) {
    console.error("Erreur handleTastingSubmit:", err);
    alert("Impossible d’envoyer la dégustation.");
  }
}

