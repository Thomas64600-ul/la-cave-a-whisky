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
    const { endpoint, redirect } = getTargetConfig(target);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newWhisky),
    });

    const result = await response.json();

    if (!response.ok) {
      alert("Erreur : " + result.message);
      return;
    }

    alert("Whisky ajouté avec succès !");
    window.location.href = redirect;

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

function getTargetConfig(target) {
  if (target === "cave") {
    return {
      endpoint: "http://127.0.0.1:5000/api/whiskies",
      redirect: "cave.html",
    };
  }

  if (target === "catalogue") {
    return {
      endpoint: "http://127.0.0.1:5000/api/catalogue",
      redirect: "api-whiskies.html",
    };
  }

  throw new Error("Cible d'ajout invalide.");
}

