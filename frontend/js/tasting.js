document.addEventListener("DOMContentLoaded", async () => {

  const params = new URLSearchParams(window.location.search);
  const whiskyId = params.get("id");

  const title = document.getElementById("whiskyName");
  const list = document.getElementById("tastingList");
  const form = document.getElementById("tastingForm");

  if (!whiskyId) {
    title.textContent = "Aucun whisky sélectionné";
    return;
  }

  async function loadWhisky() {
    try {
      const res = await fetch(`http://localhost:5000/api/whiskies/${whiskyId}`);
      const data = await res.json();

      if (!data.success) {
        title.textContent = "Whisky introuvable";
        return;
      }

      title.textContent = `${data.data.name} — Dégustations`;
    } catch (err) {
      title.textContent = "Erreur lors du chargement du whisky.";
    }
  }

  async function loadTastings() {
    list.innerHTML = "<p>Chargement...</p>";

    try {
      const res = await fetch(`http://localhost:5000/api/tastings?whisky=${whiskyId}`);
      const result = await res.json();

      list.innerHTML = "";

      result.data.forEach(t => {
        const card = document.createElement("div");
        card.className = "tasting-card";
        card.innerHTML = `
          <strong>${t.user?.username || "Anonyme"} — ★ ${t.rating}</strong>
          <p>${t.comment}</p>
        `;
        list.appendChild(card);
      });

    } catch (error) {
      list.innerHTML = "<p>Impossible de charger les avis.</p>";
    }
  }

  await loadWhisky();
  await loadTastings();

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const rating = Number(document.getElementById("rating").value);
    const comment = document.getElementById("comment").value;

    try {
      const res = await fetch("http://localhost:5000/api/tastings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whisky: whiskyId,
          rating,
          comment
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Erreur serveur");
        return;
      }

      form.reset();
      loadTastings();

    } catch (err) {
      alert("Impossible d’envoyer la dégustation.");
    }
  });
});

