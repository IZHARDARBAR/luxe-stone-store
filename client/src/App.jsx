import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import RequireAuth from "./Components/RequireAuth";
import ProtectedRoute from "./Admin/ProtectedRoute";
import ScrollToTop from "./Components/ScrollToTop"; // <--- ADDED

// Pages
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

// Admin
import AdminLogin from "./Admin/AdminLogin";
import Dashboard from "./Admin/Dashboard";
import AddProduct from "./Admin/AddProduct";
import ManageProducts from "./Admin/ManageProducts";
import ManageReviews from "./Admin/ManageReviews";
import ManageUsers from "./Admin/ManageUsers";
import ManageCoupons from "./Admin/ManageCoupons";

// --- ANIMATION WRAPPER ---
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const hideNavAndFooter =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  return (
    <div className="bg-white min-h-screen relative">
      {/* Scroll To Top Logic */}
      <ScrollToTop />

      {/* 1. CUSTOM TOAST STYLING */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #84a93e",
            padding: "12px 20px",
            fontSize: "14px",
            borderRadius: "8px",
          },
          success: { iconTheme: { primary: "#84a93e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ff4d4f", secondary: "#fff" } },
        }}
      />

      {!hideNavAndFooter && <Navbar />}

      {/* 2. PAGE TRANSITIONS */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public & Customer Routes */}
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Auth />
              </PageWrapper>
            }
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Home />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/shop"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Shop />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/product/:id"
            element={
              <RequireAuth>
                <PageWrapper>
                  <ProductDetail />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Cart />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Checkout />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/order-success"
            element={
              <RequireAuth>
                <PageWrapper>
                  <OrderSuccess />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Wishlist />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/track-order"
            element={
              <RequireAuth>
                <PageWrapper>
                  <TrackOrder />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/about"
            element={
              <RequireAuth>
                <PageWrapper>
                  <About />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/contact"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              </RequireAuth>
            }
          />
          <Route
            path="/policy"
            element={
              <RequireAuth>
                <PageWrapper>
                  <Policy />
                </PageWrapper>
              </RequireAuth>
            }
          />

          {/* Admin Routes (No Animation needed for Admin usually, but added for consistency) */}
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
          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute>
                <ManageCoupons />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

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
