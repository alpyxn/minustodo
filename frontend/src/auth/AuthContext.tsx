import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { keycloak } from './auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  keycloak: typeof keycloak;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  keycloak,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string>();

  const updateToken = useCallback(async () => {
    if (!keycloak.authenticated) return;

    try {
      const refreshed = await keycloak.updateToken(70);
      if (refreshed) {
        setToken(keycloak.token);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async () => {
    try {
      await keycloak.login({
        redirectUri: window.location.origin,
        scope: 'openid profile email'
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setToken(undefined);
    }
  };

  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        console.log('Initializing Keycloak...');
        
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false, // Disable iframe checking for security
          pkceMethod: 'S256',
          scope: 'openid profile email',
          responseMode: 'query',
          enableLogging: true,
          messageReceiveTimeout: 10000 // 10 seconds timeout for message receiving
        });

        console.log('Keycloak initialization result:', authenticated);

        if (authenticated) {
          console.log('Successfully authenticated');
          setIsAuthenticated(true);
          setToken(keycloak.token);
          
          keycloak.onTokenExpired = () => {
            console.log('Token expired, refreshing...');
            updateToken();
          };
        } else {
          console.log('Not authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeKeycloak();

    return () => {
      keycloak.onTokenExpired = undefined;
    };
  }, [updateToken]);

  // Token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(updateToken, 60000);
    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, updateToken]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      token,
      keycloak,
      login,
      logout
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
