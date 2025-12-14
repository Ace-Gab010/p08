// Backend API base URL
export const API_BASE = 'https://nestjs-amparado-ace-1.onrender.com';

// For development, use proxy to avoid CORS issues
export const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // In browser environment, check if we're in development
    const isDevelopment = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.startsWith('192.168.') ||
                          window.location.hostname.startsWith('10.') ||
                          window.location.hostname.startsWith('172.') ||
                          window.location.port === '3000' ||
                          window.location.hostname === '10.105.252.84';
    if (isDevelopment) {
      // Use Next.js proxy API route
      return '';
    }
  }
  return API_BASE;
};