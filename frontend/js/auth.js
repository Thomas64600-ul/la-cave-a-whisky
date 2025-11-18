document.addEventListener("DOMContentLoaded", async () => {

  await loadComponent("site-header", "./components/header/header.html");
  await loadComponent("site-footer", "./components/footer/footer.html");

  console.log("Auth page loaded.");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const result = await api.login({ email, password });
      alert("Connexion réussie !");
      window.location.href = "index.html";
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      const result = await api.register({ username: name, email, password });
      alert("Inscription réussie !");
      window.location.href = "login.html";
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  });

});

