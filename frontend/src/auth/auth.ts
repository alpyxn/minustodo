import Keycloak from "keycloak-js";
import axios, { AxiosInstance } from 'axios';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'task',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'taskapi',
    'public-client': true,
    'enable-cors': true,
    'confidential-port': 0,
    responseMode: 'query',
    checkLoginIframe: false, // Disable iframe checking due to sandbox issues
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    tokenStorage: 'sessionStorage' // More secure token storage
};

// Create singleton instance with proper URL handling
export const keycloak = new Keycloak({
    ...keycloakConfig,
    url: new URL(keycloakConfig.url).toString() // Ensure URL is properly formatted
});

// Configure axios with token management
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor
apiClient.interceptors.request.use(
    async config => {
        if (!keycloak.authenticated) {
            return config;
        }

        try {
            await keycloak.updateToken(70);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            return config;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return Promise.reject(error);
        }
    },
    error => Promise.reject(error)
);

// Add response interceptor
apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;
            try {
                await keycloak.updateToken(0);
                error.config.headers.Authorization = `Bearer ${keycloak.token}`;
                return apiClient(error.config);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                await keycloak.logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;