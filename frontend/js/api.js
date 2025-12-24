const hostname = window.location.hostname;

const isLocalhost =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "0.0.0.0";

const API_URL = isLocalhost
  ? "http://127.0.0.1:5000/api"
  : "https://cave-a-whisky-api.onrender.com/api";

let memoryToken = null;

function setToken(token) {
  memoryToken = token;
}

function getToken() {
  return memoryToken || localStorage.getItem("token");
}

function clearToken() {
  memoryToken = null;
  localStorage.removeItem("token");
  window.currentUser = null;
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(API_URL + endpoint, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (endpoint === "/auth/check" && res.status === 401) {
    window.currentUser = null;
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
  register: async (body) => {
    const data = await send("/auth/register", "POST", body);

    if (data?.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  login: async (body) => {
    const data = await send("/auth/login", "POST", body);

    if (data?.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  check: async () => {
    const data = await get("/auth/check");

    if (data?.success) {
      window.currentUser = data.user;
    } else {
      window.currentUser = null;
    }

    return data;
  },

  logout: async () => {
    clearToken();
    return send("/auth/logout", "POST");
  },
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
  create: (body) => send("/whiskies", "POST", body),
  update: (id, body) => send(`/whiskies/${id}`, "PUT", body),
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
  getByWhisky: (whiskyId) =>
  get(`/tastings/whisky/${whiskyId}`),
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
