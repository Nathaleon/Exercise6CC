import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom"; 

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Client-side validation for empty fields
    if (!username.trim()) {
      setMsg("Username tidak boleh kosong.");
      return;
    }
    if (!password.trim()) {
      setMsg("Password tidak boleh kosong.");
      return;
    }

    try {
      const res = await axiosInstance.post("/login", { username, password });
      setAuth({ username: res.data.username, accessToken: res.data.accessToken });
      // PENTING: Log ini untuk memverifikasi apa yang disimpan di AuthContext
      console.log("Login.js: setAuth dipanggil dengan:", { username: res.data.username, accessToken: res.data.accessToken });
      navigate("/users");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login gagal. Silakan coba lagi.");
      console.error("Login.js: Login gagal karena:", err.response?.data?.msg || err.message); 
    }
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#2c2c2c", // Dark grey background
        fontFamily: "Arial, sans-serif",
        color: "#f0f0f0", // Light text color for contrast
      }}
    >
      <div
        style={{
          backgroundColor: "#3a3a3a", // Slightly lighter dark grey for the form container
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)", // Darker shadow for depth
          width: "350px",
          maxWidth: "90%", // Responsive width
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#f0f0f0" }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {msg && (
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
              {msg}
            </p>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #555", 
              borderRadius: "5px",
              fontSize: "1em",
              backgroundColor: "#4a4a4a", 
              color: "#f0f0f0",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #555",
              borderRadius: "5px",
              fontSize: "1em",
              backgroundColor: "#4a4a4a",
              color: "#f0f0f0",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              backgroundColor: "#007bff", // A vibrant blue for the button
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1em",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")} // Darken on hover
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")} // Revert on mouse out
          >
            Login
          </button>
        </form>
        <div style={{ marginTop: "25px", fontSize: "0.9em", color: "#ccc" }}>
          <p style={{ marginBottom: "10px" }}>Belum punya akun?</p>
          <Link
            to="/register"
            style={{
              color: "#87ceeb", // A light blue for the link
              textDecoration: "none",
              fontWeight: "bold",
              transition: "color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#a0e6ff")}
            onMouseOut={(e) => (e.target.style.color = "#87ceeb")}
          >
            Daftar di sini
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
