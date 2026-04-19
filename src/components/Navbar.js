import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import {Tab} from "../App.js";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../context/theme";

export function NavBar() {
  const { isDark, toggle } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const navigate = useNavigate();
  const { setActiveTab } = useContext(Tab);
  const loggedIn = !!sessionStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);
  const profilePopup = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profilePopup.current && !profilePopup.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    if (showProfile) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  const handleNavigate = () => {
    if (!loggedIn) return;
    if (window.location.hash === "#/dashboard") { setActiveTab(-1); return; }
    navigate("/dashboard");
    setActiveTab(-1);
  };

  let user = null;
  const storeUser = sessionStorage.getItem("user");
  if (storeUser) {
    try { user = JSON.parse(storeUser); } catch (e) { user = null; }
  }

  const handleSignOut = () => {
    setShowProfile(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav style={{ ...navStyle, backgroundColor: t.navBg }}>
        <button
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            marginLeft: "12px", backgroundColor: "#F97000", color: "white",
            border: "none", borderRadius: "8px", padding: "12px 22px",
            fontWeight: "700", fontSize: "30px", fontFamily: "'Georgia', serif",
            userSelect: "none", cursor: "pointer",
          }}
          onClick={() => handleNavigate()}
        >
          UF
        </button>

        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          fontSize: "40px", fontWeight: "bold", pointerEvents: "none",
        }}>
          GatorPath
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {loggedIn && (
            <button
              onClick={() => setShowProfile(true)}
              style={{
                marginRight: "12px", backgroundColor: "#efefef", color: "#222",
                border: "1px solid #ddd", borderRadius: "8px", padding: "10px 18px",
                fontWeight: "700", fontSize: "18px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "10px",
                fontFamily: "'Georgia', serif",
              }}
            >
              <span>My Profile</span>
              {user?.profileIcon ? (
                <img src={user.profileIcon} alt="avatar"
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <span style={{
                  width: 32, height: 32, borderRadius: "50%", backgroundColor: "#d9d9d9",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", lineHeight: 1,
                }}>👤</span>
              )}
            </button>
          )}
        </div>
      </nav>

      {showProfile && loggedIn && user && (
        <div className="profile-popup" ref={profilePopup}>
          <button className="profile-popup-close" onClick={() => setShowProfile(false)}>✕</button>
          <div className="profile-popup-header">
            <img src={user.profileIcon} alt="avatar"
              style={{ width: 48, height: 48, borderRadius: "50%" }} />
            <span className="profile-popup-title">My Profile</span>
          </div>
          <div className="profile-popup-name">{user.name}</div>
          <div className="profile-popup-email">{user.email}</div>
          <Link to="/signup" className="profile-popup-link" onClick={() => setShowProfile(false)}>
            View &amp; Update Profile Information
          </Link>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee",
            marginBottom: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {isDark ? (
                // Moon icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#2E03A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                // Sun icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#2E03A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
              <span style={{ fontSize: "14px", color: "#333", fontFamily: "'Georgia', serif" }}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            </div>

            <div
              onClick={toggle}
              style={{
                width: "44px", height: "24px", borderRadius: "12px", cursor: "pointer",
                backgroundColor: isDark ? "#2E03A5" : "#ccc",
                position: "relative", transition: "background-color 0.3s",
              }}
            >
              <div style={{
                position: "absolute", top: "3px",
                left: isDark ? "23px" : "3px",
                width: "18px", height: "18px", borderRadius: "50%",
                backgroundColor: "white", transition: "left 0.3s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>

          <div className="profile-popup-section-title">My Academic Programs</div>
          <div className="profile-popup-major">
            <div style={{ marginBottom: "6px" }}>
              <span className="profile-popup-label">Major: </span>
              <span>{user.major || "—"}</span>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <span className="profile-popup-label">Minor: </span>
              <span>{Array.isArray(user.minor) ? user.minor.join(", ") || "—" : user.minor || "—"}</span>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <span className="profile-popup-label">Certificate: </span>
              <span>{Array.isArray(user.certificate) ? user.certificate.join(", ") || "—" : user.certificate || "—"}</span>
            </div>
            {user.year && (
              <div>
                <span className="profile-popup-label">Year: </span>
                <span>{user.year}</span>
              </div>
            )}
          </div>
          <button className="profile-popup-signout" onClick={handleSignOut}>↪ LOG OUT</button>
        </div>
      )}
    </>
  );
}

const navStyle = {
  position: "relative", top: 0, left: 0, width: "100%", height: "82px",
  backgroundColor: "#2E03A5", color: "white", border: "none", borderRadius: "0px",
  padding: "0px", margin: "0px", marginBottom: 0, display: "flex",
  alignItems: "center", justifyContent: "space-between",
  fontFamily: "'Georgia', serif", fontSize: "1.2em", fontWeight: "bold",
  textAlign: "left", zIndex: 10, boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
};