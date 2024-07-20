import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdForm from "./components/ads/AdForm";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import PrivateRoute from "./utils/PrivateRoute";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AdForm />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/signup" element={<ProtectedSignup />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute isAdminRoute={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// Higher-order component to wrap Login with redirection logic
const ProtectedLogin = () => {
  const { handleRedirectIfAuthenticated } = useAuth();
  return handleRedirectIfAuthenticated(<Login />);
};

// Higher-order component to wrap Signup with redirection logic
const ProtectedSignup = () => {
  const { handleRedirectIfAuthenticated } = useAuth();
  return handleRedirectIfAuthenticated(<Signup />);
};

export default App;
