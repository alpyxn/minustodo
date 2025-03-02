import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { keycloak } from './auth';
import type Keycloak from 'keycloak-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  keycloak: Keycloak;
}

const AuthContext = createContext<AuthContextType>({ 
  isAuthenticated: false, 
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  token: undefined,
  keycloak
});

const LoadingComponent = () => (
  <div>Loading authentication...</div>
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string>();
  const [isInitialized, setIsInitialized] = useState(false);

  const login = async () => {
    await keycloak.login();
  };

  const logout = async () => {
    await keycloak.logout();
  };

  const updateToken = async () => {
    try {
      await keycloak.updateToken(70);
      setToken(keycloak.token);
    } catch (error) {
      console.error('Failed to refresh token', error);
      await logout();
    }
  };

  useEffect(() => {
    keycloak.onTokenExpired = () => {
      updateToken();
    };

    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true);
      setToken(keycloak.token);
    };

    keycloak.onAuthError = () => {
      setIsAuthenticated(false);
      setToken(undefined);
    };

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setToken(undefined);
    };

    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          checkLoginIframe: false,
          pkceMethod: 'S256',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        });
        setIsAuthenticated(authenticated);
        setToken(keycloak.token);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Keycloak', error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();

    return () => {
      keycloak.onTokenExpired = undefined;
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthError = undefined;
      keycloak.onAuthLogout = undefined;
    };
  }, []);

  if (!isInitialized) {
    return <LoadingComponent />;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      token,
      login,
      logout,
      keycloak 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
