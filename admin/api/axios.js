import axios from 'axios';

// Create a custom instance
const api = axios.create({
  // This points to your Render backend (e.g., https://my-app.onrender.com/api)
  baseURL: import.meta.env.VITE_API_URL, 
  
  // CRITICAL: This allows the HTTP-Only cookie to be sent/received
  withCredentials: true 
});

export default api;