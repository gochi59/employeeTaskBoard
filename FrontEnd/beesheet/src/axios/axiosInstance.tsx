import axios from "axios";
import { changeToken, clearToken } from "../redux/HeaderSlice";
import { store } from "../redux/store";
import { jwtDecode, JwtPayload } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Important for sending cookies
});

// Function to check if the token is expired
function isTokenExpired(token: string): boolean {
  const decodedToken: any = jwtDecode<JwtPayload>(token);
  const currentTime = Math.floor(Date.now() / 1000);
//   console.log(decodedToken.exp,currentTime);         
  return decodedToken.exp <= currentTime;
}

// Function to refresh the token
async function refreshAccessToken(empId: number): Promise<string> {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/refresh",
      { id: empId },
      { withCredentials: true }
    );
    localStorage.setItem("userToken", data); // Save new token
    store.dispatch(changeToken());
    return data;
  } catch (error) {
    store.dispatch(clearToken());
    localStorage.removeItem("userToken");
    throw new Error("Unable to refresh token");
  }
}

// Request interceptor: Attach token to every request
axiosInstance.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("userToken")||"";

  if (token && isTokenExpired(token)) {
    try {
      const empId = jwtDecode<JwtPayload>(token).sub; // Get empId from Redux
      token = await refreshAccessToken(empId); // Refresh token if expired
    } catch (error) {
      return Promise.reject(error); // Return error if token refresh fails
    }
  }

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // Attach refreshed or valid token
  }

  return config;
});

// Response interceptor: Handle token expiration after response if it wasn't caught earlier
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.data === "JWT token is expired.") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
  let token = localStorage.getItem("userToken")||"";
        const empId = jwtDecode<JwtPayload>(token).sub||""; // Get empId from Redux
        const newToken = await refreshAccessToken(empId); // Refresh token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.message === "Network Error"||error.message==="Invalid JWT Token") {
      return Promise.reject(new Error("Internal Server Error"));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
