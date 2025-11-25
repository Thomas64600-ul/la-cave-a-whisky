document.addEventListener("DOMContentLoaded", () => {
  console.log("Page Ajouter un Whisky → Initialisation…");

  initAddWhiskyPage();
});

function initAddWhiskyPage() {
  const form = document.getElementById("add-whisky-form");
  const targetSelect = document.getElementById("target");
  const returnLink = document.getElementById("return-link");

  if (!form || !targetSelect) {
    console.error("Erreur : éléments introuvables dans add-whisky.html");
    return;
  }

  targetSelect.addEventListener("change", () => {
    updateReturnLink(targetSelect.value, returnLink);
  });

  form.addEventListener("submit", handleSubmit);
}

function updateReturnLink(target, link) {
  if (!link) return;

  if (target === "cave") {
    link.href = "cave.html";
    link.textContent = "← Retour à la cave";
  }

  if (target === "catalogue") {
    link.href = "api-whiskies.html";
    link.textContent = "← Retour au catalogue";
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const target = document.getElementById("target").value;

  if (!target) {
    alert("Veuillez choisir où ajouter le whisky.");
    return;
  }

  const newWhisky = collectFormData();

  try {
    if (target === "cave") {
      await window.api.whiskies.create(newWhisky);
      alert("Whisky ajouté dans la cave !");
      window.location.href = "cave.html";
      return;
    }

    if (target === "catalogue") {
      await window.api.catalogue.create(newWhisky);
      alert("Whisky ajouté au catalogue !");
      window.location.href = "api-whiskies.html";
      return;
    }

  } catch (error) {
    console.error("Erreur ajout whisky :", error);
    alert("Impossible d’ajouter le whisky.");
  }
}

function collectFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    brand: document.getElementById("brand").value.trim(),
    country: document.getElementById("country").value.trim(),
    category: document.getElementById("category").value.trim(),
    degree: Number(document.getElementById("degree").value),
    year: Number(document.getElementById("year").value),
    image: document.getElementById("image").value.trim(),
    description: document.getElementById("description").value.trim(),
  };
}

