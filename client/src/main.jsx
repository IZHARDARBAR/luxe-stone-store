import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext';
import { HelmetProvider } from 'react-helmet-async'; // <--- IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider> {/* <--- WRAP EVERYTHING HERE */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </HelmetProvider>
)