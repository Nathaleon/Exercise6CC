import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "../api/axiosInstance";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshToken = Cookies.get("refreshToken");
        
        if (refreshToken) {
          // Try to refresh the access token if refresh token exists
          console.log("AuthProvider - Found refresh token, attempting to refresh access token");
          const newAccessToken = await refreshAccessToken();
          
          if (newAccessToken && newAccessToken !== "kosong") {
            console.log("AuthProvider - Successfully refreshed access token on initialization");
          } else {
            console.log("AuthProvider - Failed to refresh token on initialization");
          }
        } else {
          console.log("AuthProvider - No refresh token found");
        }
      } catch (error) {
        console.error("AuthProvider - Error during initialization:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });

      setAccessToken(res.data.accessToken);
      setUsername(res.data.username);

      // Simpan refresh token di cookie (misalnya 5 hari)
      Cookies.set("refreshToken", res.data.refreshToken, {
        secure: true,
        sameSite: "Strict",
        expires: 5,
      });

      console.log("AuthProvider - Login successful:", { username: res.data.username, hasToken: !!res.data.accessToken });
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUsername(null);
    Cookies.remove("refreshToken");
    console.log("AuthProvider - Logout successful");
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/token`);
      setAccessToken(res.data.accessToken);
      console.log("AuthProvider - Token refreshed successfully");
      return res.data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return "kosong";
    }
  };

  // Fungsi setAuth yang dibutuhkan oleh Login component
  const setAuth = ({ username: newUsername, accessToken: newAccessToken }) => {
    setUsername(newUsername);
    setAccessToken(newAccessToken);
    console.log("AuthProvider - Auth set manually:", { username: newUsername, hasToken: !!newAccessToken });
  };

  // Create auth object for compatibility with ProtectedRoute
  const auth = accessToken && username ? { accessToken, username } : null;

  console.log("AuthProvider - Current state:", { 
    hasAccessToken: !!accessToken, 
    username, 
    isInitializing,
    authObject: auth
  });

  return (
    <AuthContext.Provider
      value={{ 
        accessToken, 
        username,
        auth, // Add this for ProtectedRoute compatibility
        isInitializing, // Add this for ProtectedRoute to wait
        login, 
        logout, 
        refreshAccessToken,
        setAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };