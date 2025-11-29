document.addEventListener("DOMContentLoaded", () => {
  console.log("Page Modifier un Whisky → Initialisation…");

  initEditWhiskyPage();
});

function initEditWhiskyPage() {
  const form = document.getElementById("edit-whisky-form");
  const returnLink = document.getElementById("return-link");

  if (!form) {
    console.error("Erreur : éléments introuvables dans edit-whisky.html");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const whiskyId = params.get("id");
  const type = params.get("type");

  if (!whiskyId || !type) {
    alert("Paramètres invalides.");
    window.location.href = "./admin.html";
    return;
  }

  updateReturnLink(type, returnLink);

  loadWhiskyData(whiskyId, type);

  form.addEventListener("submit", (e) => handleEditSubmit(e, whiskyId, type));
}

function updateReturnLink(type, link) {
  if (!link) return;

  if (type === "cave") {
    link.href = "admin.html";
    link.textContent = "← Retour à la cave";
  }

  if (type === "catalogue") {
    link.href = "admin.html";
    link.textContent = "← Retour au catalogue";
  }
}

async function loadWhiskyData(id, type) {
  try {
    const res =
      type === "catalogue"
        ? await api.catalogue.getById(id)
        : await api.whiskies.getById(id);

    if (!res.success) throw new Error("API error");

    fillEditForm(res.data);

  } catch (err) {
    console.error("Erreur chargement whisky :", err);
    alert("Impossible de charger le whisky.");
    window.location.href = "admin.html";
  }
}

function fillEditForm(w) {
  document.getElementById("name").value = w.name;
  document.getElementById("brand").value = w.brand;
  document.getElementById("country").value = w.country;
  document.getElementById("category").value = w.category;
  document.getElementById("degree").value = w.degree;

  // NOUVEAUX CHAMPS
  document.getElementById("age").value = w.age ?? "";
  document.getElementById("year").value = w.year ?? "";

  document.getElementById("image").value = w.image;
  document.getElementById("description").value = w.description ?? "";
}

function collectEditFormData() {
  const rawAge = document.getElementById("age").value.trim();
  const rawYear = document.getElementById("year").value.trim();

  return {
    name: document.getElementById("name").value.trim(),
    brand: document.getElementById("brand").value.trim(),
    country: document.getElementById("country").value.trim(),
    category: document.getElementById("category").value.trim(),
    degree: Number(document.getElementById("degree").value),

    // NOUVEAUX CHAMPS
    age: rawAge === "" ? null : Number(rawAge),
    year: rawYear === "" ? null : Number(rawYear),

    image: document.getElementById("image").value.trim(),
    description: document.getElementById("description").value.trim(),
  };
}

async function handleEditSubmit(e, id, type) {
  e.preventDefault();

  const updatedWhisky = collectEditFormData();

  try {
    if (type === "cave") {
      await api.whiskies.update(id, updatedWhisky);
      alert("Whisky modifié dans la cave !");
    } else {
      await api.catalogue.update(id, updatedWhisky);
      alert("Whisky modifié dans le catalogue !");
    }

    window.location.href = "admin.html";

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    alert("Erreur lors de l'enregistrement des modifications.");
  }
}
