import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = localStorage.getItem('auth');
      console.log("AuthProvider: Loading auth from localStorage:", storedAuth);
      
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        console.log("AuthProvider: Parsed auth:", parsedAuth);
        
      
        if (parsedAuth && parsedAuth.accessToken && parsedAuth.username) {
          console.log("AuthProvider: Valid auth found in localStorage");
          return parsedAuth;
        } else {
          console.log("AuthProvider: Invalid auth structure in localStorage");
        }
      } else {
        console.log("AuthProvider: No auth found in localStorage");
      }
      return null;
    } catch (error) {
      console.error("AuthProvider: Failed to load auth state from localStorage:", error);
      return null;
    }
  });

 
  const setAuthWithLogging = (newAuth) => {
    console.log("AuthProvider: setAuth called with:", newAuth);
    setAuth(newAuth);
  };

  // Gunakan useEffect untuk menyimpan state 'auth' ke localStorage setiap kali berubah.
  useEffect(() => {
    console.log("AuthProvider: Auth state changed:", auth);
    
    try {
      if (auth && auth.accessToken && auth.username) {
        const authToStore = JSON.stringify(auth);
        localStorage.setItem('auth', authToStore);
        console.log("AuthProvider: Auth saved to localStorage:", authToStore);
      } else {
        localStorage.removeItem('auth');
        console.log("AuthProvider: Auth removed from localStorage");
      }
    } catch (error) {
      console.error("AuthProvider: Failed to save auth state to localStorage:", error);
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth: setAuthWithLogging }}>
      {children}
    </AuthContext.Provider>
  );
};