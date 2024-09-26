import axios from "axios";
import { changeToken, clearToken } from "../redux/HeaderSlice";
import { store } from "../redux/store"; // Import your Redux store

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Important for sending cookies
});

// Request interceptor: Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.data === "JWT token is expired." ||
        error.response.data === "Invalid JWT token.") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const empId = store.getState().ID; // Get empId from the Redux store
        const { data } = await axios.post(
          "http://localhost:8080/refresh",
          { id: empId },
          { withCredentials: true }
        );

        localStorage.setItem("userToken", data); // Save new token
        store.dispatch(changeToken());

        originalRequest.headers["Authorization"] = `Bearer ${data}`;
        return axiosInstance(originalRequest); // Retry the original request with new token
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        store.dispatch(clearToken());
        localStorage.removeItem("userToken");
        return Promise.reject(refreshError);
      }
    }

    if (error.message === "Network Error") {
      return Promise.reject(new Error("Internal Server Error"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
