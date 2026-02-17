import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const appTree = (
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        {appTree}
      </GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </React.StrictMode>,
)
