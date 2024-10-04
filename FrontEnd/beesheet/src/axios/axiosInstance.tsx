import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, 
});

function isTokenExpired(token: string): boolean {
  const decodedToken: any = jwtDecode<JwtPayload>(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp <= currentTime;
}

async function refreshAccessToken(empId: number): Promise<string> {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/refresh",
      { id: empId },
      { withCredentials: true }
    );
    localStorage.setItem("userToken", data); 
    return data;
  } catch (error) {
    localStorage.removeItem("userToken");
    throw new Error("Unable to refresh token");
  }
}

axiosInstance.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("userToken")||"";

  if (token && isTokenExpired(token)) {
    try {
      const empId = jwtDecode<JwtPayload>(token).sub; 
      token = await refreshAccessToken(empId); 
    } catch (error) {
      return Promise.reject(error); 
    }
  }

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

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
        const empId = jwtDecode<JwtPayload>(token).sub||""; 
        const newToken = await refreshAccessToken(empId); 
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); 
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
