window.createCatalogueCard = function (w) {
  return `
    <div class="whisky-card">
      <a href="details.html?id=${w._id}&source=catalogue">
        <img src="${w.image}" alt="${w.name}" class="whisky-image" />
      </a>

      <h3>${w.name}</h3>

      <p><strong>Marque :</strong> ${w.brand}</p>
      <p><strong>Pays :</strong> ${w.country}</p>
      <p><strong>Catégorie :</strong> ${w.category}</p>
      <p><strong>Degré :</strong> ${w.degree}%</p>

      <a class="btn-small" href="details.html?id=${w._id}&source=catalogue">
        Voir détails
      </a>
    </div>
  `;
};

window.createCaveCard = function (w) {
  return `
    <div class="whisky-card">
      <a href="details.html?id=${w._id}&source=cave">
        <img src="${w.image}" alt="${w.name}" class="whisky-image" />
      </a>

      <h3>${w.name}</h3>

      <p><strong>Marque :</strong> ${w.brand}</p>
      <p><strong>Pays :</strong> ${w.country}</p>
      <p><strong>Catégorie :</strong> ${w.category}</p>
      <p><strong>Degré :</strong> ${w.degree}%</p>

      <div class="card-buttons">
        <a class="btn-small" href="details.html?id=${w._id}&source=cave">
          Voir détails
        </a>

        <a class="btn-small btn-note" href="tasting.html?id=${w._id}">
          Noter ce whisky
        </a>
      </div>
    </div>
  `;
};

window.createWhiskyCard = function (w) {
  if (w.source === "cave") return createCaveCard(w);
  return createCatalogueCard(w);
};






