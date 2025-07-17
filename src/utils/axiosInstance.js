import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("nnnn", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Prevent infinite retry loop
    if (
      (err.response?.status === 401 || err.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔁 Call refresh endpoint (server reads refresh token from cookie)
        const response = await axiosInstance.post("/api/auth/refresh-token");

        const newAccessToken = response.data.newAccessToken;
        localStorage.setItem("token", newAccessToken);

        // 🔁 Update header and retry
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
