import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_API;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
      <App />
      </AuthProvider>
  </StrictMode>
)