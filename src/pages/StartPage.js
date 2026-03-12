
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"
import '../components/CenteredButton.css';

export function StartUp() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF3EA",
      backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23c8a96e%27 fill-opacity=%270.10%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
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
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: "8px",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
        width: "auto",
        whiteSpace: "nowrap",
      }}>
        <h1 style={{
          fontSize: "36px",
          fontWeight: "bold",
          color: "#2E03A5",
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
          color: "#444",
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
            mixBlendMode: "multiply",
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.15))",
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