document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-header", "./components/header/header.html");
  await loadComponent("site-footer", "./components/footer/footer.html");

  loadDetails();
});

async function fetchWhisky(id) {
 
  try {
    const r1 = await fetch(`http://localhost:5000/api/catalogue/${id}`);
    const d1 = await r1.json();
    if (d1.success) return { ...d1.data, source: "catalogue" };
  } catch (e) {}

  try {
    const r2 = await fetch(`http://localhost:5000/api/whiskies/${id}`);
    const d2 = await r2.json();
    if (d2.success) return { ...d2.data, source: "cave" };
  } catch (e) {}

  return null;
}

async function loadDetails() {
  const container = document.getElementById("whisky-details");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<p>Aucun whisky sélectionné.</p>";
    return;
  }

  const w = await fetchWhisky(id);

  if (!w) {
    container.innerHTML = "<p>Whisky introuvable.</p>";
    return;
  }

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

        ${w.description ? `<p>${w.description}</p>` : ''}

        <a class="btn-primary" href="${
          w.source === 'catalogue' ? 'api-whiskies.html' : 'cave.html'
        }">
          ← Retour
        </a>
      </div>

    </div>
  `;
}



