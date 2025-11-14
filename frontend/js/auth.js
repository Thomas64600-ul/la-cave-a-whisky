document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    console.log("Tentative de connexion :", email, password);

    alert("Mock : connexion réussie !");
  });

  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    console.log("Tentative d'inscription :", name, email, password);

    alert("Mock : inscription réussie !");
  });

});
