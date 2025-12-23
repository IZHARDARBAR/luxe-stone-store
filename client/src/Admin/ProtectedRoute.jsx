import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check karein ke Admin Login hai ya nahi
  const isAdmin = localStorage.getItem('isAdmin');

  if (!isAdmin) {
    // Agar login nahi hai, to wapis Login Page par bhej do
    return <Navigate to="/admin" replace />;
  }

  // Agar login hai, to Page dikhao
  return children;
};

export default ProtectedRoute;