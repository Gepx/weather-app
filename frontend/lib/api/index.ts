import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "../handler/errorHandler";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error)) {
      if (error.response?.status === 429) {
        toast.warning("Too many requests. Please slow down.");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
