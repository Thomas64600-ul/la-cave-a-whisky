document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page → initialisation…");

  await loadComponent("site-header", "../components/header/header.html");
  await loadComponent("site-footer", "../components/footer/footer.html");

  console.log("Composants chargés ✔");

  document.dispatchEvent(new Event("header-loaded"));

  initHeaderScripts();
  if (window.initThemeSystem) initThemeSystem();
  initUserDisplay();
});

function initHeaderScripts() {
  let attempts = 0;

  function tryInit() {
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!burger || !mobileMenu) {
      attempts++;
      if (attempts < 20) return setTimeout(tryInit, 50);
      console.warn("Header non initialisé (burger / menu manquants)");
      return;
    }

    console.log("✔ Header prêt – scripts activés");

    burger.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });

    const path = window.location.pathname;
    document.querySelectorAll("[data-link]").forEach((link) => {
      const name = link.getAttribute("data-link");
      if (
        path.includes(name) ||
        (path.endsWith("index.html") && name === "index")
      ) {
        link.classList.add("active");
      }
    });
  }

  tryInit();
}

async function initUserDisplay() {
  try {
    const result = await api.auth.check();

    if (!result.success || !result.user) {
      showLoggedOut();
      enableAdminFeatures(null);
      enableCatalogueActions(null);
      return;
    }

    const user = result.user;

    showLoggedIn(user);
    enableAdminFeatures(user);
    enableCatalogueActions(user);
    addAdminLink(user);  

  } catch (err) {
    showLoggedOut();
    enableAdminFeatures(null);
    enableCatalogueActions(null);
  }
}

function showLoggedOut() {
  document.getElementById("nav-login")?.classList.remove("hidden");
  document.getElementById("nav-login-mobile")?.classList.remove("hidden");

  document.getElementById("user-info")?.classList.add("hidden");
  document.getElementById("mobile-user-info")?.classList.add("hidden");
}

function showLoggedIn(user) {
  
  const info = document.getElementById("user-info");
  if (info) {
    document.getElementById("nav-login")?.classList.add("hidden");
    info.classList.remove("hidden");

    document.getElementById("user-avatar").src = user.avatar;
    document.getElementById("user-name").textContent = user.username;

    document.getElementById("logout-btn").onclick = logoutUser;
  }

  const infoM = document.getElementById("mobile-user-info");
  if (infoM) {
    document.getElementById("nav-login-mobile")?.classList.add("hidden");
    infoM.classList.remove("hidden");

    document.getElementById("mobile-user-avatar").src = user.avatar;
    document.getElementById("mobile-user-name").textContent = user.username;

    document.getElementById("mobile-logout-btn").onclick = logoutUser;
  }
}

function addAdminLink(user) {
  if (!user || user.role !== "admin") return;

  const navDesktop = document.querySelector(".nav-desktop");
  if (navDesktop && !navDesktop.querySelector(".admin-nav-link")) {
    const a = document.createElement("a");
    a.href = "./admin.html";
    a.textContent = "Administration";
    a.classList.add("admin-nav-link");
    navDesktop.insertBefore(a, document.getElementById("nav-login"));
  }

  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenu && !mobileMenu.querySelector(".admin-nav-link")) {
    const a = document.createElement("a");
    a.href = "./admin.html";
    a.textContent = "Administration";
    a.classList.add("admin-nav-link");
    mobileMenu.insertBefore(a, document.getElementById("nav-login-mobile"));
  }
}

function enableAdminFeatures(user) {
  const addBtn = document.getElementById("btn-add-whisky");
  if (!addBtn) return;

  if (!user || user.role !== "admin") {
    addBtn.style.display = "none";
    return;
  }

  addBtn.style.display = "inline-flex";

  if (!addBtn.dataset.bound) {
    addBtn.addEventListener("click", () => {
      window.location.href = "add-whisky.html";
    });
    addBtn.dataset.bound = "true";
  }
}

function enableCatalogueActions(user) {
  const container = document.getElementById("api-actions");
  if (!container) return;

  container.innerHTML = "";

  if (!user) {
    container.innerHTML = `
      <div class="catalogue-info">
        <p>
          Vous souhaitez enrichir le catalogue ?
          <strong>Merci de vous inscrire.</strong>
        </p>
        <div class="catalogue-links">
          <a href="login.html" class="btn-secondary">Connexion</a>
          <a href="register.html" class="btn-action">Inscription</a>
        </div>
      </div>
    `;
    return;
  }

  const btn = document.createElement("button");
  btn.textContent = "➕ Ajouter un whisky";
  btn.className = "btn-action";
  btn.onclick = () => {
    window.location.href = "add-whisky.html";
  };
  container.appendChild(btn);
}

async function logoutUser() {
  await api.auth.logout();
  window.location.reload();
}

window.getCurrentUser = async function () {
  try {
    const result = await api.auth.check();
    if (result.success && result.user) return result.user;
    return null;
  } catch (err) {
    return null;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
