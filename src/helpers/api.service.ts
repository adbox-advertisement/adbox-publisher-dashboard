import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { Storage } from "./local.storage";

const BASE_URL_V1 = import.meta.env.VITE_BASE_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL_V1,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Storage.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // console.log("Attaching token:", config.headers["Authorization"]);
    } else {
      console.warn("No token found in storage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout
      Storage.clearToken?.();
    }
    return Promise.reject(error);
  }
);

// Create fresh config for each request to avoid mutation issues
const createConfig = (
  additionalConfig?: AxiosRequestConfig
): AxiosRequestConfig => ({
  ...additionalConfig,
});

// API methods
const post_api = (route: string, data: any, config?: AxiosRequestConfig) => {
  return apiClient.post(route, data, createConfig(config));
};

const get_api = (route: string, config?: AxiosRequestConfig) => {
  return apiClient.get(route, createConfig(config));
};

const put_api = (route: string, data: any, config?: AxiosRequestConfig) => {
  return apiClient.put(route, data, createConfig(config));
};

const patch_api = (route: string, data: any, config?: AxiosRequestConfig) => {
  return apiClient.patch(route, data, createConfig(config));
};

const delete_api = (route: string, config?: AxiosRequestConfig) => {
  return apiClient.delete(route, createConfig(config));
};

// File upload with form data
const upload_api = (
  route: string,
  file: File,
  additionalData?: Record<string, string>,
  config?: AxiosRequestConfig
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Add additional form fields
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return apiClient.post(
      route,
      formData,
      createConfig({
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config?.headers,
        },
      })
    );
  } catch (error) {
    console.error("Error preparing upload:", error);
    return Promise.reject(error);
  }
};

// Specific video upload method with better error handling
const uploadVideo = async (
  file: File,
  title: string,
  description: string,
  config?: AxiosRequestConfig
) => {
  try {
    // Validate inputs
    if (!file) {
      throw new Error("File is required");
    }
    if (!title || !description) {
      throw new Error("Title and description are required");
    }

    console.log("Starting video upload:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      title,
      description,
    });

    return await upload_api(
      "/ffmpeg-video-upload/upload",
      file,
      {
        title,
        description,
      },
      config
    );
  } catch (error) {
    console.error("Video upload error:", error);
    throw error;
  }
};

const ApiService = {
  post_api,
  get_api,
  put_api,
  patch_api,
  delete_api,
  upload_api,
  uploadVideo,
  // Direct access to axios instance for advanced usage
  client: apiClient,
};

export default ApiService;
