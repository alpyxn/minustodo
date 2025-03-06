const keycloakConfig = {
  url: 'http://localhost:8180',  // Use direct URL, not relative path
  realm: 'task',
  clientId: 'taskapi',
  enableLogging: true
};

export default keycloakConfig;