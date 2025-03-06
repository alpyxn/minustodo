import Keycloak from "keycloak-js";
import axios, { AxiosInstance } from 'axios';
import keycloakConfig from './keycloak-config';

// Create the Keycloak instance with proper configuration
export const keycloak = new Keycloak({
    url: keycloakConfig.url,
    realm: keycloakConfig.realm,
    clientId: keycloakConfig.clientId
});

// Configure axios with proper error handling for auth failures
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
            console.log("Not authenticated, attempting login");
            await keycloak.login();
            throw new Error('Authentication required');
        }

        try {
            const refreshed = await keycloak.updateToken(30);
            if (refreshed) {
                console.log('Token refreshed');
            }
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            return config;
        } catch (error) {
            console.error('Failed to refresh token', error);
            await keycloak.login();
            throw error;
        }
    },
    error => Promise.reject(error)
);

export default apiClient;