// src/lib/axios.ts
import axios from "axios";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    // Check if we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      if (token) {
        // Standard Bearer token format
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {

    const data = error.response?.data;

    // Handle Validation Errors (HTTP 400)
    if (error.response?.status === 400 && data?.errors) {
      data.errors.forEach((err: { field: string; message: string }) => {
        // Formats: "Permissions: At least one permission is required"
        toast.error(`${err.field.toUpperCase()}: ${err.message}`); 
      });
    } 
    // Handle General Errors
    else if (data?.message) {
      toast.error(data.message);
    } 
    else {
      toast.error("Something went wrong. Please try again.");
    }

    // If the backend returns 401, the token is likely invalid or expired
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/login"; // Force redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;