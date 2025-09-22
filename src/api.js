import axios from "axios";

/* ================================
   Axios instances
   ================================ */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send/receive httpOnly cookies
});

// a bare client to call /auth/refresh without our interceptor recursion
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ================================
   Thin wrappers (always return .data)
   ================================ */
async function get(url, params) {
  // IMPORTANT: pass params as { params }
  const res = await api.get(url, { params });
  return res.data;
}
async function post(url, data) {
  const res = await api.post(url, data);
  return res.data;
}
async function put(url, data) {
  const res = await api.put(url, data);
  return res.data;
}
async function patch(url, data) {
  const res = await api.patch(url, data);
  return res.data;
}
async function del(url) {
  const res = await api.delete(url);
  return res.data;
}

/* ================================
   API groups (only what exists)
   ================================ */

//  Auth Endpoints
export const Auth = {
  async register(payload) { return await post("/auth/register", payload); },
  async login(payload)    { return await post("/auth/login", payload); },
  async logout()          { return await post("/auth/logout"); },
  // matches interceptor above (GET). If your server is POST, switch both places.
  async refresh()         { return await refreshApi.get("/auth/refresh"); },
  async me()              { return await get("/me"); },

  async updateProfile(data)  { return await patch("/me", data); },
  async changePassword(data) { return await post("/me/change-password", data); },

  async addTeach(payload) { return await post("/me/teach", payload); },
  async removeTeach(id)   { return await del(`/me/teach/${id}`); },

  async addLearn(payload) { return await post("/me/learn", payload); },
  async removeLearn(id)   { return await del(`/me/learn/${id}`); },
};

//  Catalog Endpoints
export const Catalog = {
  async categories(params)            { return await get("/categories", params); },
  async categorySkills(idOrSlug, p)   { return await get(`/categories/${idOrSlug}/skills`, p); },
  async skills(params)                { return await get("/skills", params); },
  async skill(idOrSlug)               { return await get(`/skills/${idOrSlug}`); },
  async peopleOffer(idOrSlug, params) { return await get(`/skills/${idOrSlug}/people/offer`, params); },
  async peopleWant(idOrSlug, params)  { return await get(`/skills/${idOrSlug}/people/want`, params); },
};

/* ================================
   Post & Comments — FIXED typos
   (keep only if backend supports these)
   ================================ */
export const Post = {
  async createPost(data)      { return await post("/posts", data); },
  async getAllPost()          { return await get("/posts"); },              // no params
  async singlePost(id)        { return await get(`/posts/${id}`); },
  async authorOfThePost(id)   { return await get(`/posts/author/${id}`); },
  async updatePost(id, data)  { return await put(`/posts/${id}`, data); },
  async deletePost(id)        { return await del(`/posts/${id}`); },
  async commentsOfThePost(id) { return await get(`/comments/posts/${id}`); },
};

export const Comments = {
  async createComment(data)      { return await post(`/comments/create`, data); },       // FIX: path & comma
  async updateComment(id, data)  { return await put(`/comments/update/${id}`, data); },
  async deleteComment(id)        { return await del(`/comments/delete/${id}`); },
};
