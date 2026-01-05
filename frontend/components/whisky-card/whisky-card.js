const DEFAULT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1700000000/default-whisky.png";

function formatAge(w) {
  
  const age = w.age ?? w.year ?? null;
  return age === null || age === undefined || age === "" ? "NAS" : `${age} ans`;
}

function formatPrice(w) {
  const price = w.price ?? w.purchasePrice ?? null; 
  if (price === null || price === undefined || price === "") return "—";
  const n = Number(price);
  return Number.isFinite(n) ? `${n} €` : `${price} €`;
}

function formatPurchasePlace(w) {

  return (
    w.purchasePlace ||
    w.purchaseLocation ||
    w.buyPlace ||
    w.shop ||
    "—"
  );
}

function whiskyCardTemplate(w) {
  const img = w.image || DEFAULT_IMAGE;

  const ageText = formatAge(w);

  const extraCaveInfos =
    w.source === "cave"
      ? `
        <p><strong>Prix :</strong> ${formatPrice(w)}</p>
        <p><strong>Lieu d’achat :</strong> ${formatPurchasePlace(w)}</p>
      `
      : "";

  return `
    <a class="whisky-card" href="/pages/details.html?id=${w._id}&source=${w.source}">
      <img src="${img}" alt="${w.name || "Whisky"}" class="whisky-image" />

      <h3>${w.name || "Nom inconnu"}</h3>

      <p><strong>Marque :</strong> ${w.brand || "N/A"}</p>
      <p><strong>Pays :</strong> ${w.country || "N/A"}</p>
      <p><strong>Catégorie :</strong> ${w.category || "N/A"}</p>
      <p><strong>Degré :</strong> ${w.degree ? w.degree + "%" : "N/A"}</p>

      <p><strong>Âge :</strong> ${ageText}</p>

      ${extraCaveInfos}
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
  return w.source === "cave" ? createCaveCard(w) : createCatalogueCard(w);
};





