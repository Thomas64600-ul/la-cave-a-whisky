document.addEventListener("DOMContentLoaded", () => {
  initAuthPage();
});

function initAuthPage() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (!loginForm || !registerForm) {
    console.error("Formulaires introuvables dans login.html");
    return;
  }

  initLoginForm(loginForm);
  initRegisterForm(registerForm);

  const params = new URLSearchParams(window.location.search);
  if (params.get("registered") === "1") {
    showMessage("Inscription réussie ! Vous pouvez vous connecter.", "success");
  }
}

function initLoginForm(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      return showMessage("Veuillez remplir tous les champs.", "error");
    }

    try {
      const data = await api.auth.login({ email, password });

      if (!data.success) {
        return showMessage(data.message || "Identifiants incorrects.", "error");
      }

      window.location.href = "../index.html";

    } catch (err) {
      console.error("Erreur login :", err);
      showMessage("Impossible de se connecter.", "error");
    }
  });
}

function initRegisterForm(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !email || !password) {
      return showMessage("Veuillez remplir tous les champs.", "error");
    }

    try {
      const data = await api.auth.register({ username, email, password });

      if (!data.success) {
        return showMessage(data.message || "Erreur lors de l'inscription.", "error");
      }

      window.location.href = "./login.html?registered=1";

    } catch (err) {
      console.error("Erreur inscription :", err);
      showMessage("Impossible de créer le compte.", "error");
    }
  });
}

function showMessage(msg, type = "error") {
  const box = document.getElementById("auth-message"); 
  if (!box) return;

  box.textContent = msg;
  box.style.display = "block";

  box.classList.remove("error", "success");
  box.classList.add(type);
}

