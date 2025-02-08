import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed"); 
      }
  
      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin); 
  
      if (data.isAdmin) {
        navigate("/admin");  // ✅ Redirect Admin to Admin Page
      } else {
        navigate("/track");  // ✅ Redirect Normal User to Tracking Page
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit= {handleLogin} >
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        <input
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  autoComplete="current-password"  // ✅ Fixes Warning
/>

        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
