import { whiskys } from "./utils/whiskys.js";
import { loadComponent } from "./utils/loadComponent.js";

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("#site-header", "./components/header/header.html");
  loadComponent("#site-footer", "./components/footer/footer.html");

  renderDetails();
});

function renderDetails() {
  const container = document.getElementById("whisky-details");

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  if (!id) {
    container.innerHTML = `<p class="error">Aucun whisky sélectionné.</p>`;
    return;
  }

  const whisky = whiskys.find(w => w.id === id);

  if (!whisky) {
    container.innerHTML = `<p class="error">Whisky introuvable.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="details-content">

      <img src="${whisky.image}" 
           alt="${whisky.name}" 
           class="details-image" />

      <div class="details-info">

        <h2>${whisky.name}</h2>

        <p><strong>Marque :</strong> ${whisky.brand}</p>
        <p><strong>Pays :</strong> ${whisky.country}</p>
        <p><strong>Catégorie :</strong> ${whisky.category}</p>
        <p><strong>Degré :</strong> ${whisky.degree}%</p>
        <p><strong>Année :</strong> ${whisky.year ?? "Non renseignée"}</p>

        <div class="details-description">
          ${whisky.description}
        </div>

      </div>
    </div>
  `;

  const btnAdd = document.getElementById("add-tasting");
  btnAdd.href = `tasting.html?id=${whisky.id}`;
}
