import axios from "axios";
import { getCsrfToken, setCsrfToken } from "./security";
import { store } from "../reducer/store";
import { setUser } from "../slices/authSlice";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const publicAxios = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

export const privateAxios = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

export const initializeCsrf = async () => {
  const response = await publicAxios.get("auth/csrftoken");
  console.log("csrf token response", response);
  setCsrfToken(response?.data?.data?.csrfToken);
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(error);
  });
  failedQueue = [];
};

privateAxios.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();

  const unsafeMethods = ["post", "put", "patch", "delete"];

  const method = config.method?.toLowerCase();

  if (unsafeMethods.includes(method)) {
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
  }

  return config;
});

privateAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!error.response) {
      console.log("Network Error");
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(privateAxios(originalRequest)),
            reject,
          });
        });
      }
      try {
        await publicAxios.post("auth/refreshtoken");
        await initializeCsrf();
        processQueue();
        return privateAxios(originalRequest);
      } catch (err) {
        processQueue(err);
        store.dispatch(setUser(null));
        localStorage.clear();
        sessionStorage.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
