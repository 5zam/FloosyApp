// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5004', // Your backend URL
  appName: 'Flossy',
  version: '1.0.0'
};

// src/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://your-production-api-url.com', // Update with production URL
  appName: 'Flossy',
  version: '1.0.0'
};