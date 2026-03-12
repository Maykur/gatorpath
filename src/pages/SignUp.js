
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
// Referenced: https://stackoverflow.com/questions/45201351/masking-password-input-in-reactjs
// Referenced: https://www.youtube.com/watch?v=_M4gZfIFGZw (Cloudinary Setup)

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Navbar from "../components/Navbar"

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const inputStyle = {
  width: "100%",
  height: "48px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "15px",
  padding: "0 12px",
  boxSizing: "border-box",
  backgroundColor: "#F7F8FA",
  outline: "none",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#444",
  marginBottom: "6px",
  display: "block",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "16px",
};

export function SignUp() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/majors");
        const data = await res.json();
        setMajors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load majors", err);
      }
    })();
  }, []);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email Required."); return; }
    if (!name.trim()) { setError("Name Required."); return; }
    if (!password.trim()) { setError("Password Required."); return; }
    if (!major.trim()) { setError("Major Required."); return; }
    if (!year.trim()) { setError("Year Required."); return; }
    if (image === null) { setError("Profile Picture Required."); return; }
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("major", major);
    formData.append("year", year);
    if (image) formData.append("profileIcon", image);

    let result = await fetch("http://localhost:5000/register", {
      method: "post",
      body: formData,
    });
    let data = await result.json();
    if (!result.ok) { setError("Email In Use"); return; }
    alert("Sign-Up Saved Successfully");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/home");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF3EA",
      backgroundImage: texture,
      paddingTop: "80px",
      fontFamily: "'Georgia', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>

      {/* Page title */}
      <div style={{ marginTop: "32px", marginBottom: "28px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "40px",
          fontWeight: "bold",
          color: "#2E03A5",
          letterSpacing: "4px",
          textTransform: "uppercase",
          margin: 0,
          textShadow: "1px 2px 6px rgba(180,180,200,0.5)",
        }}>
          Create Account
        </h1>
        <p style={{ color: "#888", fontSize: "14px", marginTop: "8px", letterSpacing: "1px" }}>
          Join GatorPath today
        </p>
      </div>

      {/* Main card */}
      <div style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: "10px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.12)",
        padding: "36px 40px",
        width: "90%",
        maxWidth: "860px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        marginBottom: "40px",
      }}>

        {/* Left column: credentials */}
        <div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Username</label>
            <input style={inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: "52px" }}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: "13px",
                  color: "#888", padding: 0,
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Major</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                style={{ ...inputStyle, backgroundColor: "#F7F8FA" }}
              >
                <option value="">Select a major…</option>
                {majors.map((m) => (
                  <option key={m._id} value={m.major}>{m.major}</option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{ ...inputStyle, backgroundColor: "#F7F8FA" }}
              >
                <option value="">Select Year</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right column: profile picture */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          {/* Avatar preview */}
          <div style={{
            width: "180px",
            height: "180px",
            borderRadius: "8px",
            backgroundColor: "#e8eaf0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "2px solid #ddd",
          }}>
            {preview ? (
              <img src={preview} alt="avatar preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="30" r="18" fill="#2E03A5" opacity="0.4"/>
                <ellipse cx="40" cy="65" rx="28" ry="16" fill="#2E03A5" opacity="0.4"/>
              </svg>
            )}
          </div>
          <label style={labelStyle}>Profile Picture</label>
          <label style={{
            backgroundColor: "#2E03A5",
            color: "white",
            padding: "10px 24px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}>
            Choose File
            <input type="file" accept="image/*" onChange={handlePreview} style={{ display: "none" }} />
          </label>
          {image && <span style={{ fontSize: "12px", color: "#666" }}>{image.name}</span>}
        </div>
      </div>

      {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>{error}</p>}

      {/* Sign up button */}
      <button
        onClick={handleOnSubmit}
        style={{
          width: "340px",
          height: "60px",
          backgroundColor: "transparent",
          border: "3px solid #F97000",
          color: "#F97000",
          fontSize: "22px",
          fontWeight: "bold",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "24px",
          letterSpacing: "1px",
        }}
      >
        Sign Up
      </button>

      <p style={{ color: "#555", fontSize: "14px", marginBottom: "40px" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#2E03A5", fontWeight: "bold" }}>Login</Link>
      </p>
    </div>
  );
}