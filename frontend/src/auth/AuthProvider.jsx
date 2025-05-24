import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "../api/axiosInstance";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState(null);

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
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/token`);
      setAccessToken(res.data.accessToken);
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
  };

  return (
    <AuthContext.Provider
      value={{ 
        accessToken, 
        username,
        login, 
        logout, 
        refreshAccessToken,
        setAuth // Tambahkan setAuth ke context
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