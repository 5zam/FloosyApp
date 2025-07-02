export const environment = {
  production: false,
  apiUrl: 'http://localhost:5004', // Use HTTP port, not HTTPS
  appName: 'Flossy',
  version: '1.0.0'
};

// src/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://your-production-api-url.com',
  appName: 'Flossy',
  version: '1.0.0'
};