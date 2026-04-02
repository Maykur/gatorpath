
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
// Referenced: https://stackoverflow.com/questions/45201351/masking-password-input-in-reactjs

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import '../components/CenteredButton.css';
import { baseUrl } from "../constants";

export function LogIn() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email required."); return; }
    if (!password.trim()) { setError("Password required."); return; }
    setError("");

    const result = await fetch(`${baseUrl}/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await result.json();
    if (!result.ok) { setError("Invalid email or password."); return; }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF3EA",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "80px",
      fontFamily: "'Georgia', serif",
    }}>

      {/* Unified login card */}
      <div style={{
        marginTop: "36px",
        backgroundColor: "rgba(255,255,255,0.45)",
        borderRadius: "10px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.12)",
        padding: "40px 48px",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        {/* Title inside card */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#2E03A5",
            margin: 0,
            letterSpacing: "6px",
            textTransform: "uppercase",
            textShadow: "1px 2px 6px rgba(180,180,200,0.5)",
          }}>
            Login
          </h1>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "8px", letterSpacing: "1px", margin: "8px 0 0 0" }}>
            Welcome back to GatorPath
          </p>
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "15px", color: "#444", fontWeight: "600" }}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              height: "52px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
              padding: "0 14px",
              boxSizing: "border-box",
              backgroundColor: "#F7F8FA",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "15px", color: "#444", fontWeight: "600" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                height: "52px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
                padding: "0 48px 0 14px",
                boxSizing: "border-box",
                backgroundColor: "#F7F8FA",
                outline: "none",
                width: "100%",
              }}
            />
            {/* Show/hide inside input */}
            <button
              onClick={() => setShowPass(p => !p)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: "#888",
                padding: 0,
              }}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <p style={{ color: "red", fontSize: "13px", margin: 0 }}>{error}</p>}

        {/* Login button */}
        <button
          className="large-submit"
          onClick={handleOnSubmit}
          style={{
            marginTop: "8px",
            width: "100%",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", color: "#555", fontSize: "14px", margin: 0 }}>
          New here?{" "}
          <Link to="/signup" style={{ color: "#2E03A5", fontWeight: "bold" }}>
            Sign up!
          </Link>
        </p>
      </div>
    </div>
  );
}