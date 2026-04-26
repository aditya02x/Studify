import axios from "axios";

const api = axios.create({
  // baseURL: "https://studify-1-ww39.onrender.com",
  baseURL: "https://studify-1-ww39.onrender.com/api",
  withCredentials: true
});

// ✅ ADD TOKEN AUTOMATICALLY
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;