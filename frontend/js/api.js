const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_URL = isLocalhost
  ? "http://127.0.0.1:5000/api"
  : "https://cave-a-whisky-api.onrender.com/api";



async function request(endpoint, options = {}) {
  const res = await fetch(API_URL + endpoint, {
    credentials: "include", 
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (endpoint === "/auth/check" && res.status === 401) {
    return { success: false, user: null };
  }

  if (!res.ok) {
    console.error("API ERROR →", endpoint, data);
    throw new Error(data.message || "Erreur API");
  }

  return data;
}

function get(endpoint) {
  return request(endpoint);
}

function send(endpoint, method, body = {}) {
  return request(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function sendForm(endpoint, method, formData) {
  return request(endpoint, {
    method,
    body: formData,
  });
}

const auth = {
  register: (body) => send("/auth/register", "POST", body),
  login: (body) => send("/auth/login", "POST", body),
  check: () => get("/auth/check"),
  logout: () => send("/auth/logout", "POST"),
};

const users = {
  getAll: () => get("/users"),
  getById: (id) => get(`/users/${id}`),
  update: (id, body) => send(`/users/${id}`, "PUT", body),
  delete: (id) => send(`/users/${id}`, "DELETE"),
};

const whiskies = {
  getAll: () => get("/whiskies"),
  getById: (id) => get(`/whiskies/${id}`),
  create: (data) => sendForm("/whiskies", "POST", data),
  update: (id, data) => sendForm(`/whiskies/${id}`, "PUT", data),
  delete: (id) => send(`/whiskies/${id}`, "DELETE"),
};

const catalogue = {
  getAll: () => get("/catalogue"),
  getById: (id) => get(`/catalogue/${id}`),
  create: (body) => send("/catalogue", "POST", body),
  update: (id, body) => send(`/catalogue/${id}`, "PUT", body),
  delete: (id) => send(`/catalogue/${id}`, "DELETE"),
};

const tastings = {
  getAll: () => get("/tastings"),
  getMine: () => get("/tastings/mine"),
  getById: (id) => get(`/tastings/${id}`),
  create: (body) => send("/tastings", "POST", body),
  update: (id, body) => send(`/tastings/${id}`, "PUT", body),
  delete: (id) => send(`/tastings/${id}`, "DELETE"),
};

window.api = {
  auth,
  users,
  whiskies,
  catalogue,
  tastings,
};



