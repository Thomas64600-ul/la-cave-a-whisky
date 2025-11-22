document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  initAdminPage();
});

async function initAdminPage() {
  const auth = await api.auth.check();

  if (!auth.success || auth.user.role !== "admin") {
    alert("Accès réservé à l’administrateur.");
    window.location.href = "index.html";
    return;
  }

  initAdminTabs();

  loadCatalogueAdmin();
  loadCaveAdmin();
  loadTastingsAdmin();
  loadUsersAdmin();

  initAdminButtons();
}

function initAdminTabs() {
  const tabs = document.querySelectorAll(".admin-tabs button");
  const sections = document.querySelectorAll(".admin-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById("admin-" + tab.dataset.tab).classList.add("active");
    });
  });
}

async function loadCatalogueAdmin() {
  const box = document.getElementById("admin-catalogue-list");
  box.innerHTML = `<div class="loading">Chargement…</div>`;

  const res = await api.catalogue.getAll();

  if (!res.success) {
    box.innerHTML = `<p class="error">Erreur lors du chargement du catalogue.</p>`;
    return;
  }

  box.innerHTML = "";
  res.data.forEach((w) => box.appendChild(createAdminWhiskyItem(w, "catalogue")));
}

async function loadCaveAdmin() {
  const box = document.getElementById("admin-cave-list");
  box.innerHTML = `<div class="loading">Chargement…</div>`;

  const res = await api.whiskies.getAll();

  if (!res.success) {
    box.innerHTML = `<p class="error">Erreur lors du chargement de la cave.</p>`;
    return;
  }

  box.innerHTML = "";
  res.data.forEach((w) => box.appendChild(createAdminWhiskyItem(w, "cave")));
}

async function loadTastingsAdmin() {
  const box = document.getElementById("admin-tastings-list");
  box.innerHTML = `<div class="loading">Chargement…</div>`;

  const res = await api.tastings.getAll();

  if (!res.success) {
    box.innerHTML = `<p class="error">Erreur lors du chargement des dégustations.</p>`;
    return;
  }

  box.innerHTML = "";

  res.data.forEach((t) => {
    const item = document.createElement("div");
    item.className = "tasting-item";

    item.innerHTML = `
      <p><strong>${t.user.username}</strong> → <em>${t.whisky.name}</em></p>
      <p>Note : ${t.rating}/5</p>
      <p>${t.comment}</p>
      <button class="btn-delete" data-id="${t._id}" data-type="tasting">Supprimer</button>
    `;

    box.appendChild(item);
  });

  bindDeleteButtons();
}

async function loadUsersAdmin() {
  const box = document.getElementById("admin-users-list");
  box.innerHTML = `<div class="loading">Chargement…</div>`;

  const res = await api.users.getAll();

  if (!res.success) {
    box.innerHTML = `<p class="error">Erreur lors du chargement des utilisateurs.</p>`;
    return;
  }

  box.innerHTML = "";

  res.data.forEach((u) => {
    const div = document.createElement("div");
    div.className = "user-item";

    div.innerHTML = `
      <img src="${u.avatar}" class="user-avatar" />

      <div class="user-info">
        <p><strong>${u.username}</strong></p>
        <p>${u.email}</p>
        <p class="user-role-label">Rôle : <strong>${u.role}</strong></p>
      </div>

      <button class="btn-delete" data-id="${u._id}" data-type="user">
        Supprimer
      </button>
    `;

    box.appendChild(div);
  });

  bindDeleteButtons();
}

function bindDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type;

      if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

      if (type === "catalogue") await api.catalogue.delete(id);
      if (type === "cave") await api.whiskies.delete(id);
      if (type === "tasting") await api.tastings.delete(id);
      if (type === "user") await api.users.delete(id);

      alert("Supprimé !");
      location.reload();
    });
  });
}

function createAdminWhiskyItem(w, type) {
  const div = document.createElement("div");
  div.className = "admin-item";

  div.innerHTML = `
    <img src="${w.image}" class="admin-item-img">
    <p><strong>${w.name}</strong></p>
    <p>${w.brand}</p>

    <button class="btn-delete" data-type="${type}" data-id="${w._id}">
      Supprimer
    </button>
  `;

  return div;
}

function initAdminButtons() {
  const btnCatalogue = document.getElementById("add-catalogue-btn");
  const btnCave = document.getElementById("add-cave-btn");

  if (btnCatalogue)
    btnCatalogue.onclick = () => (window.location.href = "add-whisky.html#catalogue");

  if (btnCave)
    btnCave.onclick = () => (window.location.href = "add-whisky.html#cave");
}
