import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import RequireAuth from './Components/RequireAuth';

// Public Pages (Customer)
import Auth from './Pages/Auth'; // Login Page
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import ProductDetail from './Pages/ProductDetail';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderSuccess from './Pages/OrderSuccess';
import TrackOrder from './Pages/TrackOrder';
import Profile from './Pages/Profile';
import Wishlist from './Pages/Wishlist';

// Admin Pages (Owner)
import AdminLogin from './Admin/AdminLogin';
import Dashboard from './Admin/Dashboard';
import AddProduct from './Admin/AddProduct';
import ManageProducts from './Admin/ManageProducts';
import ManageReviews from './Admin/ManageReviews';
import ManageUsers from './Admin/ManageUsers'; // <--- NEW IMPORT
import ProtectedRoute from './Admin/ProtectedRoute';

function App() {
  const location = useLocation();

  // Logic: Hide Navbar/Footer on Admin and Login Pages
  const hideNavAndFooter = location.pathname === '/login' || location.pathname.startsWith('/admin');

  return (
    <div className="bg-white min-h-screen">
      
      {/* Toast Config */}
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {/* Navbar (Conditional) */}
      {!hideNavAndFooter && <Navbar />}
      
      <Routes>
        
        {/* --- AUTH ROUTE --- */}
        <Route path="/login" element={<Auth />} />

        {/* --- CUSTOMER ROUTES (Protected) --- */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/shop" element={<RequireAuth><Shop /></RequireAuth>} />
        <Route path="/product/:id" element={<RequireAuth><ProductDetail /></RequireAuth>} />
        <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
        <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
        <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/order-success" element={<RequireAuth><OrderSuccess /></RequireAuth>} />
        <Route path="/track-order" element={<RequireAuth><TrackOrder /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />

        {/* --- ADMIN ROUTES (Secure) --- */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />

        <Route 
          path="/admin/add-product" 
          element={<ProtectedRoute><AddProduct /></ProtectedRoute>} 
        />

        <Route 
          path="/admin/products" 
          element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} 
        />

        <Route 
          path="/admin/reviews" 
          element={<ProtectedRoute><ManageReviews /></ProtectedRoute>} 
        />

        {/* NEW USER MANAGEMENT ROUTE */}
        <Route 
          path="/admin/users" 
          element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} 
        />

      </Routes>

      {/* Footer (Conditional) */}
      {!hideNavAndFooter && <Footer />}

    </div>
  );
}

export default App;