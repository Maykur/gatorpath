import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import '../components/CenteredButton.css';
import { baseUrl } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export function LogIn() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

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

    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    navigate("/dashboard");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: t.bg,
      backgroundImage: texture,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "80px",
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{
        marginTop: "36px",
        backgroundColor: t.card,
        borderRadius: "10px",
        boxShadow: t.shadow,
        padding: "40px 48px",
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        border: `1px solid ${t.border}`,
      }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <h1 style={{
            fontSize: "48px", fontWeight: "bold", color: t.accent,
            margin: 0, letterSpacing: "6px", textTransform: "uppercase",
            textShadow: "1px 2px 6px rgba(180,180,200,0.5)",
          }}>
            Login
          </h1>
          <p style={{ color: t.textMuted, fontSize: "14px", letterSpacing: "1px", margin: "8px 0 0 0" }}>
            Welcome back to GatorPath
          </p>
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "15px", color: t.textMuted, fontWeight: "600" }}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              height: "52px", borderRadius: "4px", border: `1px solid ${t.border}`,
              fontSize: "16px", padding: "0 14px", boxSizing: "border-box",
              backgroundColor: t.inputBg, outline: "none", width: "100%",
              color: t.text,
            }}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "15px", color: t.textMuted, fontWeight: "600" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                height: "52px", borderRadius: "4px", border: `1px solid ${t.border}`,
                fontSize: "16px", padding: "0 48px 0 14px", boxSizing: "border-box",
                backgroundColor: t.inputBg, outline: "none", width: "100%",
                color: t.text,
              }}
            />
            <button
              onClick={() => setShowPass(p => !p)}
              style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", fontSize: "16px",
                color: t.textMuted, padding: 0,
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
            marginTop: "8px", width: "100%", fontSize: "20px",
            fontWeight: "bold", borderRadius: "4px",
          }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", color: t.textMuted, fontSize: "14px", margin: 0 }}>
          New here?{" "}
          <Link to="/signup" style={{ color: t.accent, fontWeight: "bold" }}>
            Sign up!
          </Link>
        </p>
      </div>
    </div>
  );
}