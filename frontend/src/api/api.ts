import axios, { AxiosInstance } from "axios";
import { keycloak } from "../auth/auth"; // Add this import
import { Todo } from "../types/todo";

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

apiClient.interceptors.request.use(
    async config => {
        const token = keycloak?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
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
  const response = await apiClient.get(API_ENDPOINTS.FETCH_TASKS);
  return response.data;
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
