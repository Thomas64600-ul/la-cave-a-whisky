import { whiskys } from "./utils/whiskys.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-whisky-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newWhisky = {
      id: whiskys.length + 1,
      name: document.getElementById("name").value,
      brand: document.getElementById("brand").value,
      country: document.getElementById("country").value,
      category: document.getElementById("category").value,
      degree: Number(document.getElementById("degree").value),
      year: Number(document.getElementById("year").value),
      image: document.getElementById("image").value,
      description: document.getElementById("description").value,
    };

    whiskys.push(newWhisky);

    alert("Whisky ajouté avec succès !");
    window.location.href = "cave.html";
  });
});
