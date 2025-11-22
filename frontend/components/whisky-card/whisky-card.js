const DEFAULT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1700000000/default-whisky.png";

function whiskyCardTemplate(w) {
  const img = w.image || DEFAULT_IMAGE;

  return `
    <a class="whisky-card" href="details.html?id=${w._id}&source=${w.source}">
      
      <img src="${img}" alt="${w.name || "Whisky"}" class="whisky-image" />

      <h3>${w.name || "Nom inconnu"}</h3>

      <p><strong>Marque :</strong> ${w.brand || "N/A"}</p>
      <p><strong>Pays :</strong> ${w.country || "N/A"}</p>
      <p><strong>Catégorie :</strong> ${w.category || "N/A"}</p>
      <p><strong>Degré :</strong> ${w.degree ? w.degree + "%" : "N/A"}</p>
      
    </a>
  `;
}

window.createCatalogueCard = function (w) {
  return whiskyCardTemplate({ ...w, source: "catalogue" });
};

window.createCaveCard = function (w) {
  return whiskyCardTemplate({ ...w, source: "cave" });
};

window.createWhiskyCard = function (w) {
  return w.source === "cave"
    ? createCaveCard(w)
    : createCatalogueCard(w);
};






