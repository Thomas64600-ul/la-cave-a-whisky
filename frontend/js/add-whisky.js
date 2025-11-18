document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-whisky-form");
  const returnLink = document.getElementById("return-link");

  document.getElementById("target").addEventListener("change", (e) => {
    const target = e.target.value;

    if (target === "cave") {
      returnLink.href = "cave.html";
      returnLink.textContent = "Retour à la cave";
    }

    if (target === "catalogue") {
      returnLink.href = "api-whiskies.html";
      returnLink.textContent = "Retour au catalogue";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const target = document.getElementById("target").value;

    if (!target) {
      alert("Veuillez choisir où vous souhaitez ajouter ce whisky.");
      return;
    }

    const newWhisky = {
      name: document.getElementById("name").value,
      brand: document.getElementById("brand").value,
      country: document.getElementById("country").value,
      category: document.getElementById("category").value,
      degree: Number(document.getElementById("degree").value),
      year: Number(document.getElementById("year").value),
      image: document.getElementById("image").value,
      description: document.getElementById("description").value,
    };

    try {
      let endpoint = "";
      let redirect = "";

      if (target === "cave") {
        endpoint = "http://localhost:5000/api/whiskies";
        redirect = "cave.html";
      }

      if (target === "catalogue") {
        endpoint = "http://localhost:5000/api/catalogue";
        redirect = "api-whiskies.html";
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newWhisky),
      });

      const result = await res.json();

      if (!res.ok) {
        alert("Erreur : " + result.message);
        return;
      }

      alert("Whisky ajouté avec succès !");
      window.location.href = redirect;

    } catch (error) {
      console.error("Erreur ajout :", error);
      alert("Impossible d’ajouter le whisky.");
    }
  });
});
