import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

export function NavBar() {
  const navigate = useNavigate();
  const loggedIn = !!localStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);

  let user = null;
  const storeUser = localStorage.getItem("user");
  if (storeUser) {
    try { user = JSON.parse(storeUser); }
    catch (e) { user = null; }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        {/* Left: UF Logo */}
        <div className="navbar-left">
          <Link to={loggedIn ? "/home" : "/"} style={{ textDecoration: "none" }}>
            <span className="uf-logo">UF</span>
          </Link>
        </div>

        {/* Center: Page title / brand (only on dashboard) */}
        {loggedIn && (
          <div className="navbar-center">
            <Link to="/home" state={{ resetTab: true }} style={{ textDecoration: "none" }}>
              <span className="navbar-title">User Dashboard</span>
            </Link>
          </div>
        )}

        {/* Right: GatorPath badge + profile */}
        <div className="navbar-right">
          {loggedIn && user ? (
            <button
              className="gatorpath-badge"
              onClick={() => setShowProfile((p) => !p)}
            >
              GatorPath&nbsp;
              <img
                src={user.profileIcon}
                alt="profile"
                style={{ width: 28, height: 28, borderRadius: "50%", verticalAlign: "middle" }}
              />
            </button>
          ) : (
            <span className="gatorpath-badge-plain">GatorPath</span>
          )}
        </div>
      </nav>

      {/* Profile pop-up panel */}
      {showProfile && loggedIn && user && (
        <div className="profile-popup">
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
          <Link to="/home" className="profile-popup-link" onClick={() => setShowProfile(false)}>
            View &amp; Update Profile Information
          </Link>
          <div className="profile-popup-section-title">My Academic Programs</div>
          {user.major && (
            <div className="profile-popup-major">
              <div className="profile-popup-label">Undergraduate</div>
              <div>Major — {user.major}</div>
            </div>
          )}
          {user.year && (
            <div className="profile-popup-year">Year: {user.year}</div>
          )}
          <button className="profile-popup-signout" onClick={handleSignOut}>
            ↪ LOG OUT
          </button>
        </div>
      )}
    </>
  );
}