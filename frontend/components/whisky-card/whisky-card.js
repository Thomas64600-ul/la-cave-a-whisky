export function createWhiskyCard(whisky) {
  const card = document.createElement("div");
  card.classList.add("whisky-card");

  card.innerHTML = `
    <img src="${whisky.image}" alt="${whisky.name}" />
    <h3>${whisky.name}</h3>
    <p>${whisky.origin}</p>
  `;

  return card;
}
