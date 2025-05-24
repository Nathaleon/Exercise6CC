import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom"; 

const Login = () => {
  const { login } = useAuth(); // Gunakan fungsi login dari AuthProvider
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");

    // Client-side validation for empty fields
    if (!username.trim()) {
      setError("Username tidak boleh kosong.");
      return;
    }
    if (!password.trim()) {
      setError("Password tidak boleh kosong.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        console.log("Login.js: Login berhasil");
        navigate("/users");
      } else {
        setError("Username atau password salah.");
      }
    } catch (err) {
      console.error("Login.js: Error saat login:", err);
      setError("Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
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
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {error && (
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
              {error}
            </p>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            disabled={isLoading}
            style={{
              padding: "12px",
              border: "1px solid #555", 
              borderRadius: "5px",
              fontSize: "1em",
              backgroundColor: isLoading ? "#2a2a2a" : "#4a4a4a", 
              color: "#f0f0f0",
              outline: "none",
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            style={{
              padding: "12px",
              border: "1px solid #555",
              borderRadius: "5px",
              fontSize: "1em",
              backgroundColor: isLoading ? "#2a2a2a" : "#4a4a4a",
              color: "#f0f0f0",
              outline: "none",
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "12px 20px",
              backgroundColor: isLoading ? "#555" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1em",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.backgroundColor = "#0056b3";
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.target.style.backgroundColor = "#007bff";
            }}
          >
            {isLoading ? "Loading..." : "Login"}
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
              pointerEvents: isLoading ? "none" : "auto",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.color = "#a0e6ff";
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.target.style.color = "#87ceeb";
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