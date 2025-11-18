const API_URL = "http://localhost:5000/api";


async function apiGet(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur API");

  return data;
}

async function apiSend(endpoint, method = "POST", body = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur API");

  return data;
}

async function apiSendForm(endpoint, method = "POST", formData) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    credentials: "include",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur API");

  return data;
}

function register(body) {
  return apiSend("/auth/register", "POST", body);
}

function login(body) {
  return apiSend("/auth/login", "POST", body);
}

function checkAuth() {
  return apiGet("/auth/check");
}

function getUsers() {
  return apiGet("/users");
}

function getUserById(id) {
  return apiGet(`/users/${id}`);
}

function updateUser(id, body) {
  return apiSend(`/users/${id}`, "PUT", body);
}

function updateUserAvatar(id, file) {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiSendForm(`/users/${id}/avatar`, "PUT", formData);
}

function deleteUser(id) {
  return apiSend(`/users/${id}`, "DELETE");
}

function getWhiskies() {
  return apiGet("/whiskies");
}

function getWhiskyById(id) {
  return apiGet(`/whiskies/${id}`);
}

function createWhisky(data) {
  return apiSendForm("/whiskies", "POST", data);
}

function updateWhisky(id, data) {
  return apiSendForm(`/whiskies/${id}`, "PUT", data);
}

function deleteWhisky(id) {
  return apiSend(`/whiskies/${id}`, "DELETE");
}

function getTastings() {
  return apiGet("/tastings");
}

function getMyTastings() {
  return apiGet("/tastings/mine");
}

function getTastingById(id) {
  return apiGet(`/tastings/${id}`);
}

function createTasting(body) {
  return apiSend("/tastings", "POST", body);
}

function updateTasting(id, body) {
  return apiSend(`/tastings/${id}`, "PUT", body);
}

function deleteTasting(id) {
  return apiSend(`/tastings/${id}`, "DELETE");
}

function getCatalogue() {
  return apiGet("/catalogue");
}

function getCatalogueById(id) {
  return apiGet(`/catalogue/${id}`);
}

function createCatalogue(body) {
  return apiSend("/catalogue", "POST", body);
}

function updateCatalogue(id, body) {
  return apiSend(`/catalogue/${id}`, "PUT", body);
}

function deleteCatalogue(id) {
  return apiSend(`/catalogue/${id}`, "DELETE");
}

function importCatalogue() {
  return apiSend("/catalogue/import", "POST");
}

window.api = {
  register,
  login,
  checkAuth,

  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  deleteUser,

  getWhiskies,
  getWhiskyById,
  createWhisky,
  updateWhisky,
  deleteWhisky,

  getTastings,
  getMyTastings,
  getTastingById,
  createTasting,
  updateTasting,
  deleteTasting,

  getCatalogue,
  getCatalogueById,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  importCatalogue,
};

console.log("api.js chargé ✔");
