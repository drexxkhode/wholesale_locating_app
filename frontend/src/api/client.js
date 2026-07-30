// Central place that talks to your Express API.
// Set VITE_API_URL in a .env file, e.g. VITE_API_URL=https://your-api.onrender.com/api
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const TOKEN_KEY = "turfarena_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(method === "GET" || method === "HEAD"
      ? {}
      : { body: body ? (isForm ? body : JSON.stringify(body)) : undefined }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, opts = {}) => request(path, { method: "POST", body, ...opts }),
  put: (path, body, opts = {}) => request(path, { method: "PUT", body, ...opts }),
  patch: (path, body, opts = {}) => request(path, { method: "PATCH", body, ...opts }),
  del: (path) => request(path, { method: "DELETE" }),
};

/*
 * Expected backend contract (build these routes in Express against your single `users` table):
 *
 * POST /api/auth/login
 *   body: { email, password }
 *   200: { token, user: { id, name, email, role: "superadmin" | "company", companyId, status } }
 *
 * POST /api/auth/register            (public — a wholesaler signs itself up)
 *   body: { companyName, email, password, phone, address }
 *   Creates one row in `users` (role: "company", status: "pending" or "active")
 *   AND one row in `companies` linked by companyId.
 *   200/201: { token, user } or { message: "Registered, pending approval" }
 *
 * GET /api/auth/me                   (Authorization: Bearer <token>)
 *   200: { user }
 *
 * All three roles (user / superadmin / company) live in the same `users` table,
 * differentiated by a `role` column, exactly as you described.
 */
