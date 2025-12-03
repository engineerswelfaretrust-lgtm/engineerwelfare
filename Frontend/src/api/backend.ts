// Lightweight frontend API client for the backend
const rawBase = import.meta.env.VITE_BACKEND_URL as string | undefined;
const DEFAULT_BACKEND = "http://localhost:5000";
const resolvedBase =
  rawBase && rawBase.trim() !== "" ? rawBase : DEFAULT_BACKEND;
const BASE = resolvedBase.replace(/\/+$/, "");

function getToken() {
  return localStorage.getItem("token");
}

function buildHeaders(isJson = true) {
  const headers: Record<string, string> = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const t = getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  return headers;
}

async function request(path: string, opts: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, opts);
  const text = await res.text();
  let body: any = text;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch (e) {
    /* not json */
  }
  if (!res.ok) {
    const err = new Error(
      body && body.message ? body.message : `Request failed: ${res.status}`
    );
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return body;
}

export const api = {
  health: {
    check: () => request("/api/health"),
  },

  debug: {
    cloudinary: () => request("/api/debug/cloudinary"),
  },

  contacts: {
    create: (payload: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    }) =>
      request("/api/contacts", {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
    list: () => request("/api/contacts"),
  },

  admin: {
    register: (payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) =>
      request("/api/admin/register", {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      request("/api/admin/login", {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
  },

  doctors: {
    // register expects multipart/form-data with passportPhoto and certificates files
    register: (form: FormData) =>
      request("/api/doctors/register", { method: "POST", body: form }),
    login: (payload: { email: string; password: string }) =>
      request("/api/doctors/login", {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
    list: (status?: string) => {
      const q = status ? `?status=${encodeURIComponent(status)}` : "";
      return request(`/api/doctors${q}`);
    },
    get: (id: string) =>
      request(`/api/doctors/${id}`, { headers: buildHeaders(true) }),
    updateProfile: (id: string, form: FormData) =>
      request(`/api/doctors/${id}/profile`, {
        method: "PATCH",
        headers: buildHeaders(false),
        body: form,
      }),
    update: (id: string, form: FormData) =>
      request(`/api/doctors/${id}`, {
        method: "PATCH",
        headers: buildHeaders(false),
        body: form,
      }),
    approve: (id: string, payload: { disease: string; message?: string }) =>
      request(`/api/doctors/${id}/approve`, {
        method: "PATCH",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
    deceased: (
      id: string,
      payload: { reason?: string; diseaseName?: string }
    ) =>
      request(`/api/doctors/${id}/deceased`, {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
  },
  engineers: {
    // register expects multipart/form-data with passportPhoto and certificates files
    register: (form: FormData) =>
      request("/api/engineers/register", { method: "POST", body: form }),
    login: (payload: { email: string; password: string }) =>
      request("/api/engineers/login", {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
    list: (status?: string) => {
      const q = status ? `?status=${encodeURIComponent(status)}` : "";
      return request(`/api/engineers${q}`);
    },
    get: (id: string) =>
      request(`/api/engineers/${id}`, { headers: buildHeaders(true) }),
    updateProfile: (id: string, form: FormData) =>
      request(`/api/engineers/${id}/profile`, {
        method: "PATCH",
        headers: buildHeaders(false),
        body: form,
      }),
    update: (id: string, form: FormData) =>
      request(`/api/engineers/${id}`, {
        method: "PATCH",
        headers: buildHeaders(false),
        body: form,
      }),
    approve: (id: string, payload: { disease: string; message?: string }) =>
      request(`/api/engineers/${id}/approve`, {
        method: "PATCH",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
    deceased: (
      id: string,
      payload: { reason?: string; diseaseName?: string }
    ) =>
      request(`/api/engineers/${id}/deceased`, {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(payload),
      }),
  },
};

export default api;
