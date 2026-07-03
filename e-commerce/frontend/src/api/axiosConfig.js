import axios from "axios";

// Public API instance (no Authorization header)
export const axiosPublic = axios.create({
  baseURL: "http://localhost:8080/api/public/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosPublic.interceptors.request.use(
//   (config) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (e) {
//       // ignore
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Private API instance (for protected routes) — attaches auth token
export const axiosPrivate = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Adding token to request:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token found in localStorage');
      }
    } catch (e) {
      console.error('❌ Error adding token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptors for visibility
axiosPublic.interceptors.response.use((r) => r, (e) => Promise.reject(e));
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized (401) - authentication required");
    }
    return Promise.reject(error);
  }
);

export default axiosPublic;