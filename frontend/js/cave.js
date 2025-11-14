import { whiskys } from "./utils/whiskys.js";
import { createWhiskyCard } from "../components/whisky-card/whisky-card.js";

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("cave-list");

  if (!list) {
    console.error("Element #cave-list introuvable dans cave.html");
    return;
  }

  whiskys.forEach((whisky) => {
    const card = createWhiskyCard(whisky);
    list.appendChild(card);
  });
});
