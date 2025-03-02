import './App.css';
import { createRoot } from 'react-dom/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from './auth/auth';
import App from './App.tsx';

const initOptions = {
  onLoad: 'check-sso',
  checkLoginIframe: false,
  pkceMethod: 'S256',
  enableLogging: true,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
};

const loadingComponent = (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-lg text-gray-600">Loading...</div>
  </div>
);

const onKeycloakEvent = (event: unknown, error: unknown) => {
  if (error) {
    console.error('Keycloak error:', error);
  }
};

const onKeycloakTokens = (tokens: unknown) => {
};

createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider
    initOptions={initOptions}
    LoadingComponent={loadingComponent}
    authClient={keycloak}
    onEvent={onKeycloakEvent}
    onTokens={onKeycloakTokens}
  >
    <App />
  </ReactKeycloakProvider>
);