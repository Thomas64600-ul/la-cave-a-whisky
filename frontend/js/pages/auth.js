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
}

function initLoginForm(form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      return alert("Veuillez remplir tous les champs.");
    }

    try {
      
      const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" 
      });

      const data = await res.json();

      if (!data.success) {
        return alert("Erreur : " + data.message);
      }

      alert("Connexion réussie !");
      window.location.href = "index.html";

    } catch (err) {
      console.error("Erreur login :", err);
      alert("Erreur : " + err.message);
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
      return alert("Veuillez remplir tous les champs.");
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include"
      });

      const data = await res.json();

      if (!data.success) {
        return alert("Erreur : " + data.message);
      }

      alert("Inscription réussie !");
      window.location.href = "login.html";

    } catch (err) {
      console.error("Erreur inscription :", err);
      alert("Erreur : " + err.message);
    }
  });
}
