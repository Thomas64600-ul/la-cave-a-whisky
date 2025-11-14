const tastings = [
  {
    user: "Paul",
    rating: 5,
    comment: "Un whisky doux, boisé, avec une belle longueur."
  },
  {
    user: "Louis",
    rating: 4,
    comment: "Excellent équilibre entre le fruité et la tourbe."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("tastingList");
  const form = document.getElementById("tastingForm");

  function renderTastings() {
    list.innerHTML = "";

    tastings.forEach(t => {
      const card = document.createElement("div");
      card.className = "tasting-card";
      card.innerHTML = `
        <strong>${t.user} — ★ ${t.rating}</strong>
        <p>${t.comment}</p>
      `;
      list.appendChild(card);
    });
  }

  renderTastings();

  form.addEventListener("submit", e => {
    e.preventDefault();

    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    tastings.unshift({
      user: "Utilisateur",
      rating,
      comment
    });

    form.reset();
    renderTastings();
  });
});
