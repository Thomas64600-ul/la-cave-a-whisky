console.log("EDIT WHISKY → Script chargé ✔");

document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  const params = new URLSearchParams(window.location.search);
  const whiskyId = params.get("id");
  const type = params.get("type"); 

  if (!whiskyId || !type) {
    alert("Paramètres manquants pour l'édition.");
    window.location.href = "./admin.html";
    return;
  }

  const whisky = await fetchWhiskyData(whiskyId, type);
  if (!whisky) return;

  fillEditForm(whisky);

  document.getElementById("edit-whisky-form").addEventListener("submit", (e) => {
    e.preventDefault();
    updateWhisky(whiskyId, type);
  });
});

async function fetchWhiskyData(id, type) {
  try {
    const response =
      type === "catalogue"
        ? await api.catalogue.getOne(id)
        : await api.whiskies.getOne(id);

    if (!response.success) throw new Error("Erreur API");

    return response.data;

  } catch (err) {
    console.error(err);
    alert("Impossible de charger le whisky.");
    window.location.href = "./admin.html";
  }
}

function fillEditForm(w) {
  document.getElementById("name").value = w.name;
  document.getElementById("brand").value = w.brand;
  document.getElementById("country").value = w.country;
  document.getElementById("category").value = w.category;
  document.getElementById("degree").value = w.degree;
  document.getElementById("year").value = w.year || "";
  document.getElementById("image").value = w.image;
  document.getElementById("description").value = w.description ?? "";
}

async function updateWhisky(id, type) {
  const body = {
    name: document.getElementById("name").value,
    brand: document.getElementById("brand").value,
    country: document.getElementById("country").value,
    category: document.getElementById("category").value,
    degree: Number(document.getElementById("degree").value),
    year: Number(document.getElementById("year").value) || null,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  try {
    const response =
      type === "catalogue"
        ? await api.catalogue.update(id, body)
        : await api.whiskies.update(id, body);

    if (!response.success) throw new Error("Erreur API update");

    alert("Whisky mis à jour !");
    window.location.href = "./admin.html";

  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'enregistrement des modifications.");
  }
}
