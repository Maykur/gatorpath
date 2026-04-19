// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"
import '../components/CenteredButton.css';
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export function StartUp() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const navigate = useNavigate();

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

      {/* Title box */}
      <div style={{
        marginTop: "12px",
        marginBottom: "40px",
        textAlign: "center",
        padding: "32px 48px",
        backgroundColor: t.card,
        borderRadius: "8px",
        boxShadow: t.shadow,
        border: `1px solid ${t.border}`,
        width: "auto",
        whiteSpace: "nowrap",
      }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: t.accent,
          letterSpacing: "2px",
          textTransform: "uppercase",
          margin: 0,
          lineHeight: "1.2",
          textShadow: "1px 2px 6px rgba(180,180,200,0.5)",
          whiteSpace: "nowrap",
        }}>
          Your Academic &amp; Career Compass
        </h1>
        <p style={{
          marginTop: "14px",
          marginBottom: 0,
          color: t.textMuted,
          fontSize: "15px",
          letterSpacing: "1px",
          whiteSpace: "normal",
        }}>
          Navigate your UF CISE journey with confidence
        </p>
      </div>

      {/* Gator mascot image */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <img
          src="/gator.png"
          alt="UF Gator"
          style={{
            width: "200px",
            height: "auto",
            mixBlendMode: isDark ? "normal" : "multiply",
            filter: isDark
              ? "drop-shadow(0 4px 10px rgba(0,0,0,0.4)) brightness(0.9)"
              : "drop-shadow(0 4px 10px rgba(0,0,0,0.15))",
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button className="large-button" style={{
            width: "340px",
            height: "64px",
            fontSize: "20px",
            borderRadius: "4px",
            fontWeight: "600",
          }}>
            Login
          </button>
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <button className="large-button" style={{
            width: "340px",
            height: "64px",
            fontSize: "20px",
            borderRadius: "4px",
            fontWeight: "600",
          }}>
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}