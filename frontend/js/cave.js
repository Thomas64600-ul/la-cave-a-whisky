import { createWhiskyCard } from "../components/whisky-card/whisky-card.js";

const whiskies = [
  {
    name: "Glenfiddich 18",
    origin: "Écosse",
    image: "assets/images/mock1.png"
  },
  {
    name: "Lagavulin 16",
    origin: "Écosse",
    image: "assets/images/mock2.png"
  },
  {
    name: "Macallan Sherry",
    origin: "Écosse",
    image: "assets/images/mock3.png"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("cave-list");

  whiskies.forEach((whisky) => {
    const card = createWhiskyCard(whisky);
    list.appendChild(card);
  });
});
