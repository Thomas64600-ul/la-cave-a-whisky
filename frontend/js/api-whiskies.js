document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("site-header", "./components/header/header.html");
  await loadComponent("site-footer", "./components/footer/footer.html");

  loadAPIWhiskies();
});

async function loadAPIWhiskies() {
  const container = document.querySelector("#api-whisky-list");

  try {
   
    const result = await api.getCatalogue();  

    if (!result.success) {
      console.error("Erreur API catalogue :", result.message);
      container.innerHTML = "<p>Erreur lors du chargement des whiskys.</p>";
      return;
    }

    const whiskies = result.data;
    container.innerHTML = "";

    whiskies.forEach((w) => {
      const html = createCatalogueCard(w);  
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html.trim();
      container.appendChild(wrapper.firstElementChild);
    });

  } catch (error) {
    console.error("Erreur catalogue :", error);
    container.innerHTML = "<p>Impossible de charger les whiskys.</p>";
  }
}






