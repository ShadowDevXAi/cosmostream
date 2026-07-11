// src/lib/api.ts
import axios from 'axios';

// Yeh tumhare .env file se URL utha lega
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Optional: Agar tum JWT/API Key store kar rahe ho
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('api_key');
  if (apiKey) {
    config.headers['x-api-key'] = apiKey; 
  }
  return config;
});
