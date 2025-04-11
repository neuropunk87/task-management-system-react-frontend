import axios from "axios";
import { store } from "../store";
import { logoutUser } from "./authSlice";

const BASE_URL = "https://task-management-sys-backend-ef3eff66e369.herokuapp.com/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // const token = store.getState().auth.user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = store.getState().auth.user?.refresh;
//         const response = await axios.post(`${BASE_URL}users/token/refresh/`,
//             { refresh: refreshToken });
//
//         store.dispatch(setCredentials(response.data));
//
//         axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access}`;
//         originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
