import Keycloak from "keycloak-js";
import axios, { AxiosInstance } from 'axios';

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
    realm: 'task',
    clientId: 'taskapi'
};

// Create singleton instance
export const keycloak = new Keycloak(keycloakConfig);

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

apiClient.interceptors.request.use(
    async config => {
        if (!keycloak.authenticated) {
            try {
                await keycloak.login({
                    redirectUri: window.location.origin
                });
            } catch (error) {
                console.error('Login failed:', error);
                return Promise.reject(error);
            }
            return Promise.reject('Authentication required');
        }

        try {
            await keycloak.updateToken(70);
        } catch (error) {
            console.error('Token refresh failed:', error);
            await keycloak.login({
                redirectUri: window.location.origin
            });
            return Promise.reject(error);
        }

        const token = keycloak.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            try {
                await keycloak.updateToken(70);
                const token = keycloak.token;
                error.config.headers.Authorization = `Bearer ${token}`;
                return apiClient.request(error.config);
            } catch (e) {
                console.error('Token refresh failed:', e);
                await keycloak.login({
                    redirectUri: window.location.origin
                });
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;