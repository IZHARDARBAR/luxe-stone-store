import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MessageCircle } from "lucide-react";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import RequireAuth from "./Components/RequireAuth";
import ProtectedRoute from "./Admin/ProtectedRoute";

// Public Pages
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderSuccess from "./Pages/OrderSuccess";
import TrackOrder from "./Pages/TrackOrder";
import Wishlist from "./Pages/Wishlist";
import Policy from "./Pages/Policy";
import Profile from "./Pages/Profile";
import Contact from "./Pages/Contact";
import About from "./Pages/About";

// Admin Pages
import AdminLogin from "./Admin/AdminLogin";
import Dashboard from "./Admin/Dashboard";
import AddProduct from "./Admin/AddProduct";
import ManageProducts from "./Admin/ManageProducts";
import ManageReviews from "./Admin/ManageReviews";
import ManageUsers from "./Admin/ManageUsers";
import ManageCoupons from "./Admin/ManageCoupons"; // <--- IMPORT

function App() {
  const location = useLocation();
  const hideNavAndFooter =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  return (
    <div className="bg-white min-h-screen relative">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {!hideNavAndFooter && <Navbar />}

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Auth />} />

        {/* Customer Routes (Protected) */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/shop"
          element={
            <RequireAuth>
              <Shop />
            </RequireAuth>
          }
        />
        <Route
          path="/product/:id"
          element={
            <RequireAuth>
              <ProductDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <Checkout />
            </RequireAuth>
          }
        />
        <Route
          path="/order-success"
          element={
            <RequireAuth>
              <OrderSuccess />
            </RequireAuth>
          }
        />
        <Route
          path="/wishlist"
          element={
            <RequireAuth>
              <Wishlist />
            </RequireAuth>
          }
        />
        <Route
          path="/track-order"
          element={
            <RequireAuth>
              <TrackOrder />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/about"
          element={
            <RequireAuth>
              <About />
            </RequireAuth>
          }
        />
        <Route
          path="/contact"
          element={
            <RequireAuth>
              <Contact />
            </RequireAuth>
          }
        />
        <Route
          path="/policy"
          element={
            <RequireAuth>
              <Policy />
            </RequireAuth>
          }
        />

        {/* Admin Routes (Secure) */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute>
              <ManageReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        {/* NEW ROUTE: COUPONS */}
        <Route
          path="/admin/coupons"
          element={
            <ProtectedRoute>
              <ManageCoupons />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideNavAndFooter && <Footer />}

      {!location.pathname.startsWith("/admin") && (
        <a
          href="https://wa.me/923554952450?text=Hi, I need help!"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl z-[100] hover:scale-110 transition animate-bounce"
        >
          <MessageCircle size={28} />
        </a>
      )}
    </div>
  );
}

export default App;
