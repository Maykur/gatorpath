import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";
import {Tab} from "../App.js";

export function NavBar() {
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
    if (showProfile) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showProfile]);
  const handleNavigate = () => {
    if (!loggedIn) {
      return;
    }
    if (window.location.hash === "#/dashboard"){
      setActiveTab(-1);
      return;
    }
    navigate("/dashboard");
    setActiveTab(-1);
  }
  let user = null;
  const storeUser = sessionStorage.getItem("user");
  if (storeUser) {
    try { user = JSON.parse(storeUser); }
    catch (e) { user = null; }
  }

  const handleSignOut = () => {
    setShowProfile(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav style={navStyle}>
        {/* LEFT: UF */}
        <div
          style={{
            marginLeft: "12px",
            backgroundColor: "#F97000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 22px",
            fontWeight: "700",
            fontSize: "30px",
            fontFamily: "'Georgia', serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            cursor: "pointer",
          }}
          onClick={() => handleNavigate()}
        >
          UF
        </div>

        {/* CENTER: keep empty spacer (remove User Dashboard button only) */}
        <div style={{ flex: 1 }} />

        {/* RIGHT: GatorPath/Profile */}
        <button
          onClick={() => {
            if (!loggedIn) {
              return;
            }
            setShowProfile(true);
          }}
          style={{
            marginRight: "12px",
            backgroundColor: "#efefef",
            color: "#222",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px 18px",
            fontWeight: "700",
            fontSize: "30px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "'Georgia', serif",
          }}
        >
          <span>GatorPath</span>
          {user?.profileIcon ? (
            <img
              src={user.profileIcon}
              alt="avatar"
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#d9d9d9",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                lineHeight: 1,
              }}
            >
              👤
            </span>
          )}
        </button>
      </nav>

      {/* Profile pop-up panel */}
      {showProfile && loggedIn && user && (
        <div className="profile-popup" ref={profilePopup}>
          <button className="profile-popup-close" onClick={() => setShowProfile(false)}>✕</button>
          <div className="profile-popup-header">
            <img
              src={user.profileIcon}
              alt="avatar"
              style={{ width: 48, height: 48, borderRadius: "50%" }}
            />
            <span className="profile-popup-title">Profile</span>
          </div>
          <div className="profile-popup-name">{user.name}</div>
          <div className="profile-popup-email">{user.email}</div>
          <Link to="/signup" className="profile-popup-link" onClick={() => setShowProfile(false)}>
            View &amp; Update Profile Information
          </Link>
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
          <button className="profile-popup-signout" onClick={handleSignOut}>
            ↪ LOG OUT
          </button>
        </div>
      )}
    </>
  );
}

const navStyle = {
  position: "relative",
  top: 0,
  left: 0,
  width: "100%",
  height: "82px",
  backgroundColor: "#2E03A5", // restore gator blue
  color: "white",
  border: "none",
  borderRadius: "0px",
  padding: "0px",
  margin: "0px",
  marginBottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "'Georgia', serif", // was Arial
  fontSize: "1.2em",
  fontWeight: "bold",
  textAlign: "left",
  zIndex: 10,
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
};