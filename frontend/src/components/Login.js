import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom"; 

const Login = () => {
  // Debug: Cek apakah useAuth berfungsi
  const authContext = useAuth();
  console.log("Login.js: AuthContext:", authContext);

  const navigate = useNavigate();
  
  // State dengan nama yang berbeda untuk menghindari konflik
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    error: "",
    isLoading: false
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log("Login.js: handleSubmit called");
    console.log("Login.js: Current loginData:", loginData);
    
    // Clear previous errors
    setLoginData(prev => ({ ...prev, error: "" }));

    // Client-side validation
    if (!loginData.username.trim()) {
      console.log("Login.js: Username kosong");
      setLoginData(prev => ({ ...prev, error: "Username tidak boleh kosong." }));
      return;
    }
    
    if (!loginData.password.trim()) {
      console.log("Login.js: Password kosong");
      setLoginData(prev => ({ ...prev, error: "Password tidak boleh kosong." }));
      return;
    }

    if (!authContext || !authContext.login) {
      console.error("Login.js: AuthContext tidak tersedia");
      setLoginData(prev => ({ ...prev, error: "Authentication service tidak tersedia." }));
      return;
    }

    setLoginData(prev => ({ ...prev, isLoading: true }));

    try {
      console.log("Login.js: Memanggil authContext.login");
      const success = await authContext.login(loginData.username, loginData.password);
      
      if (success) {
        console.log("Login.js: Login berhasil");
        navigate("/users");
      } else {
        console.log("Login.js: Login gagal - credentials salah");
        setLoginData(prev => ({ 
          ...prev, 
          error: "Username atau password salah.",
          isLoading: false 
        }));
      }
    } catch (err) {
      console.error("Login.js: Exception saat login:", err);
      setLoginData(prev => ({ 
        ...prev, 
        error: "Login gagal. Silakan coba lagi.",
        isLoading: false 
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value,
      error: prev.error ? "" : prev.error // Clear error when typing
    }));
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#2c2c2c",
        fontFamily: "Arial, sans-serif",
        color: "#f0f0f0",
      }}
    >
      <div
        style={{
          backgroundColor: "#3a3a3a",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
          width: "350px",
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#f0f0f0" }}>Login</h2>
        
        {/* Debug info */}
        <div style={{ fontSize: "0.8em", color: "#999", marginBottom: "15px" }}>
          Auth Available: {authContext ? "Yes" : "No"}
          {authContext && <div>Login Function: {typeof authContext.login}</div>}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {loginData.error && (
            <p
              style={{
                color: "#ff6b6b", 
                fontSize: "0.95em",
                marginBottom: "15px",
                backgroundColor: "#5a3d3d", 
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ff6b6b",
              }}
            >
              {loginData.error}
            </p>
          )}
          
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            disabled={loginData.isLoading}
            style={{
              padding: "12px",
              border: "1px solid #555", 
              borderRadius: "5px",
              fontSize: "1em",
              backgroundColor: loginData.isLoading ? "#2a2a2a" : "#4a4a4a", 
              color: "#f0f0f0",
              outline: "none",
              opacity: loginData.isLoading ? 0.6 : 1,
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            disabled={loginData.isLoading}
            style={{
              padding: "12px",
              border: "1px solid #555",
              borderRadius: "5px",
              fontSize: "1em",
              backgroundColor: loginData.isLoading ? "#2a2a2a" : "#4a4a4a",
              color: "#f0f0f0",
              outline: "none",
              opacity: loginData.isLoading ? 0.6 : 1,
            }}
          />
          
          <button
            type="submit"
            disabled={loginData.isLoading}
            style={{
              padding: "12px 20px",
              backgroundColor: loginData.isLoading ? "#555" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1em",
              cursor: loginData.isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              opacity: loginData.isLoading ? 0.6 : 1,
            }}
          >
            {loginData.isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        
        <div style={{ marginTop: "25px", fontSize: "0.9em", color: "#ccc" }}>
          <p style={{ marginBottom: "10px" }}>Belum punya akun?</p>
          <Link
            to="/register"
            style={{
              color: "#87ceeb",
              textDecoration: "none",
              fontWeight: "bold",
              transition: "color 0.3s ease",
              pointerEvents: loginData.isLoading ? "none" : "auto",
              opacity: loginData.isLoading ? 0.6 : 1,
            }}
          >
            Daftar di sini
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;