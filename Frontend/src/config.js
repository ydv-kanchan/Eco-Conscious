// API Configuration (Vite)
// Use `import.meta.env.VITE_API_URL` which Vite exposes to the client.
// Fallback to localhost for development when the env var is not set.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
