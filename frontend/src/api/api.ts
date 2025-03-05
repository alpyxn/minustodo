import axios, { AxiosInstance } from "axios";
import { keycloak } from "../auth/auth"; 
import { Todo } from "../types/todo";

// Create an API client with proper configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Check if a token is about to expire (within the given seconds)
const isTokenExpired = (minValidity = 30) => {
    if (!keycloak.tokenParsed) {
        return true;
    }
    
    const expiresIn = keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000);
    return expiresIn < minValidity;
};

// Improved request interceptor with better token refresh and error handling
apiClient.interceptors.request.use(
    async config => {
        // If not authenticated, don't add the token
        if (!keycloak.authenticated) {
            console.log('User is not authenticated, skipping authentication header');
            return config;
        }
        
        try {
            // Only refresh if token is about to expire
            if (isTokenExpired(70)) {
                console.log('Token is about to expire, refreshing...');
                await keycloak.updateToken(70);
                console.log('Token was successfully refreshed');
            }
            
            // Set the token in the request header
            const token = keycloak.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                // Store token in localStorage for persistence
                localStorage.setItem('kc_token', token);
            } else {
                console.warn('No token available despite being authenticated');
            }
        } catch (error) {
            console.error('Failed to refresh token in request interceptor', error);
            // Force re-authentication if token refresh fails
            await keycloak.login();
        }
        
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor to handle 401 errors more robustly
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('Received 401 error, attempting to refresh token');
            
            try {
                // Clear existing token that might be invalid
                localStorage.removeItem('kc_token');
                
                // Force token refresh
                await keycloak.updateToken(0);
                console.log('Token refreshed after 401 error');
                
                // Update authorization header with new token
                const newToken = keycloak.token;
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    localStorage.setItem('kc_token', newToken);
                    return apiClient.request(originalRequest);
                } else {
                    throw new Error('No token available after refresh');
                }
            } catch (refreshError) {
                console.error('Failed to refresh token after 401', refreshError);
                // Redirect to login page
                await keycloak.login();
                return Promise.reject(error);
            }
        }
        
        // For other errors, just reject the promise
        return Promise.reject(error);
    }
);

const API_ENDPOINTS = {
  FETCH_TASKS: "/task/get",
  ADD_TASK: "/task/addTask",
  COMPLETE_TASK: "/task/completed",
  UNCOMPLETE_TASK: "/task/uncompleted",
  DELETE_TASK: (id: string) => `/task/delete/${id}`,
  DELETE_ALL: "/task/deleteAll",
} as const;

export async function fetchTasks(): Promise<Todo[]> {
  try {
    // Ensure authenticated before making the request
    if (!keycloak.authenticated) {
      console.log('User is not authenticated, redirecting to login');
      await keycloak.login();
      throw new Error('Authentication required');
    }
    
    const response = await apiClient.get(API_ENDPOINTS.FETCH_TASKS);
    return response.data;
  } catch (error) {
    console.error('Error loading tasks:', error);
    throw error;
  }
}

export async function addTask(taskText: string): Promise<Todo> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ADD_TASK, taskText, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to add task:', error);
    throw new Error('Failed to add task');
  }
}

export async function updateTaskStatus(
  taskId: number,
  newStatus: number
): Promise<string> {
  try {
    const id = taskId.toString();
    const endpoint =
      newStatus === 1
        ? API_ENDPOINTS.COMPLETE_TASK
        : API_ENDPOINTS.UNCOMPLETE_TASK;
    
    const response = await apiClient.put(endpoint, id, {
      headers: { "Content-Type": "text/plain" },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string): Promise<number> {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_TASK(taskId));
    return response.data;
  } catch (error) {
    throw new Error("Error deleting task: " + error);
  }
}

export async function deleteAllTasks(): Promise<Todo[]> {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_ALL);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting all tasks: " + error);
  }
}
