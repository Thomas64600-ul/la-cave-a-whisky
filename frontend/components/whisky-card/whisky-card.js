export function createWhiskyCard(whisky) {
  const template = document.createElement("div");
  template.innerHTML = `
    <div class="whisky-card">
      <img class="whisky-image" src="${whisky.image}" alt="${whisky.name}" />

      <h3 class="whisky-name">${whisky.name}</h3>

      <p class="whisky-info">
        <strong>Marque :</strong> ${whisky.brand}<br />
        <strong>Pays :</strong> ${whisky.country}<br />
        <strong>Catégorie :</strong> ${whisky.category}<br />
        <strong>Degré :</strong> ${whisky.degree}%
      </p>

      <button class="details-btn" data-id="${whisky.id}">
        Voir détails
      </button>
    </div>
  `;

  const button = template.querySelector(".details-btn");
  button.addEventListener("click", () => {
    window.location.href = `details.html?id=${whisky.id}`;
  });

  return template.firstElementChild;
}


