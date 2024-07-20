import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [token, setToken] = useState(localStorage.getItem("token")); // Token state
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          logoutHandler(); // Token expired, logout user
        } else {
          setUser(decodedToken); // Set user data from token
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        logoutHandler(); // Logout if token is invalid
      }
    }
  }, [token]);

  const loginHandler = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    try {
      const decodedToken = jwtDecode(token);
      // Check if token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        logoutHandler(); // Token expired, logout user
      } else {
        setUser(decodedToken);
      }
    } catch (error) {
      console.error("Failed to decode token during login:", error);
      logoutHandler(); // Logout if token is invalid
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("token"); // On logout Clear localStorage
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const handleRedirectIfAuthenticated = (component) => {
    if (user) {
      navigate("/");
      return null; // Return null to prevent rendering the wrapped component
    }
    return component;
  };

  const authContextValue = {
    user,
    token,
    loginHandler,
    logoutHandler,
    isAuthenticated,
    handleRedirectIfAuthenticated,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
