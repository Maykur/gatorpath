// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
// Referenced: https://stackoverflow.com/questions/45201351/masking-password-input-in-reactjs
// Referenced: https://www.youtube.com/watch?v=_M4gZfIFGZw (Cloudinary Setup)

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { baseUrl } from "../constants";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const inputStyle = {
  width: "100%", height: "48px", borderRadius: "4px",
  border: "1px solid #ccc", fontSize: "15px", padding: "0 12px",
  boxSizing: "border-box", backgroundColor: "#F7F8FA", outline: "none",
};

const labelStyle = {
  fontSize: "14px", fontWeight: "600", color: "#444",
  marginBottom: "6px", display: "block",
};

const fieldStyle = {
  display: "flex", flexDirection: "column", marginBottom: "16px",
};

const addBtnStyle = {
  background: "none", border: "none", color: "#2E03A5",
  fontSize: "13px", cursor: "pointer", padding: "4px 0",
  textAlign: "left", fontWeight: "600",
};

const removeBtnStyle = {
  background: "none", border: "none", color: "#aaa",
  fontSize: "18px", cursor: "pointer", padding: "0 6px",
  lineHeight: 1, flexShrink: 0,
};

const AVATAR_COLORS = ["#2E03A5", "#F97000", "#e63946", "#2a9d8f", "#6d6875", "#264653"];

export function SignUp() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [minors, setMinors] = useState([""]);
  const [certificates, setCertificates] = useState([""]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [majors, setMajors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [avatarMode, setAvatarMode] = useState(false);
  const [avatarColor, setAvatarColor] = useState("#2E03A5");
  const [avatarStyle, setAvatarStyle] = useState("initials");

  const isLoggedIn = !!sessionStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://${baseUrl}/majors`);
        const data = await res.json();
        setMajors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load majors", err);
      }
    })();

    if (isLoggedIn) {
      try {
        const stored = sessionStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          if (u.name) setName(u.name);
          if (u.email) setEmail(u.email);
          if (u.major) setMajor(u.major);
          if (u.year) setYear(u.year);
          if (u.profileIcon) setPreview(u.profileIcon);
          if (u.minor && u.minor.length > 0) setMinors(u.minor);
          if (u.certificate && u.certificate.length > 0) setCertificates(u.certificate);
        }
      } catch (e) {}
    }
  }, []);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateMinor = (i, val) => { const updated = [...minors]; updated[i] = val; setMinors(updated); };
  const addMinor = () => setMinors([...minors, ""]);
  const removeMinor = (i) => setMinors(minors.filter((_, idx) => idx !== i));

  const updateCert = (i, val) => { const updated = [...certificates]; updated[i] = val; setCertificates(updated); };
  const addCert = () => setCertificates([...certificates, ""]);
  const removeCert = (i) => setCertificates(certificates.filter((_, idx) => idx !== i));

  const generateAvatarDataUrl = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = avatarColor;
    ctx.beginPath();
    ctx.arc(100, 100, 100, 0, Math.PI * 2);
    ctx.fill();
    if (avatarStyle === "initials") {
      const initials = name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
      ctx.fillStyle = "white";
      ctx.font = "bold 80px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initials, 100, 105);
    } else {
      ctx.font = "100px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🐊", 100, 110);
    }
    return canvas.toDataURL("image/png");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email Required."); return; }
    if (!name.trim()) { setError("Name Required."); return; }
    if (!major.trim()) { setError("Major Required."); return; }
    if (!year.trim()) { setError("Year Required."); return; }
    if (!isLoggedIn && !password.trim()) { setError("Password Required."); return; }
    if (!isLoggedIn && !image && !avatarMode) { setError("Profile Picture Required."); return; }
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password.trim()) formData.append("password", password);
    formData.append("major", major);
    formData.append("year", year);
    formData.append("minor", minors.filter(m => m.trim()).join(","));
    formData.append("certificate", certificates.filter(c => c.trim()).join(","));
    if (image) {
      formData.append("profileIcon", image);
    }
    else if (avatarMode) {
      const dataUrl = generateAvatarDataUrl();
      const [header, data] = dataUrl.split(',');
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
      const blob = new Blob([array], { type: mime });
      formData.append("profileIcon", new File([blob], "avatar.png", { type: "image/png" }));
    }

    const token = sessionStorage.getItem("token");
    const url = isLoggedIn ? `http://${baseUrl}/profile` : `http://${baseUrl}/register`;
    const method = isLoggedIn ? "PUT" : "POST";
    const headers = isLoggedIn ? { Authorization: `Bearer ${token}` } : {};

    let result = await fetch(url, { method, headers, body: formData });
    let data = await result.json();
    if (!result.ok) { 
      console.log("Error response:", JSON.stringify(data));
      setError(typeof data.message === "string" ? data.message : JSON.stringify(data)); 
      return; 
    }

    if (data.token) {
      sessionStorage.setItem("token", data.token);
    }
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture,
      paddingTop: "80px", fontFamily: "'Georgia', serif",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ marginTop: "32px", marginBottom: "28px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "40px", fontWeight: "bold", color: "#2E03A5",
          letterSpacing: "4px", textTransform: "uppercase", margin: 0,
          textShadow: "1px 2px 6px rgba(180,180,200,0.5)",
        }}>
          {isLoggedIn ? "Update Profile" : "Create Account"}
        </h1>
        <p style={{ color: "#888", fontSize: "14px", marginTop: "8px", letterSpacing: "1px" }}>
          {isLoggedIn ? "Update your information below" : "Join GatorPath today"}
        </p>
      </div>

      <div style={{
        backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "10px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.12)", padding: "36px 40px",
        width: "90%", maxWidth: "860px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "24px",
      }}>
        {/* Left column */}
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
            <label style={labelStyle}>
              Password{" "}
              {isLoggedIn && <span style={{ fontWeight: "normal", color: "#aaa", fontSize: "12px" }}>(leave blank to keep current)</span>}
            </label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: "52px" }}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLoggedIn ? "Leave blank to keep current" : ""}
              />
              <button onClick={() => setShowPass(p => !p)} style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", fontSize: "13px", color: "#888", padding: 0,
              }}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Major</label>
              <select value={major} onChange={(e) => setMajor(e.target.value)} style={{ ...inputStyle, backgroundColor: "#F7F8FA" }}>
                <option value="">Select a major…</option>
                {majors.map((m) => (
                  <option key={m._id} value={m.major}>{m.major}</option>
                ))}
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} style={{ ...inputStyle, backgroundColor: "#F7F8FA" }}>
                <option value="">Select Year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
                <option value="Fifth Year">Fifth Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right column: profile picture / avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderRadius: "6px", overflow: "hidden", border: "1px solid #ddd", width: "100%" }}>
            {["Upload Photo", "Choose Avatar"].map((tab, i) => (
              <button key={tab} onClick={() => { setAvatarMode(i === 1); setImage(null); setPreview(""); }} style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                backgroundColor: avatarMode === (i === 1) ? "#2E03A5" : "transparent",
                color: avatarMode === (i === 1) ? "white" : "#444",
                fontSize: "13px", fontWeight: "600", fontFamily: "'Georgia', serif",
              }}>{tab}</button>
            ))}
          </div>

          {/* Preview circle */}
          <div style={{
            width: "160px", height: "160px", borderRadius: "50%",
            backgroundColor: "#e8eaf0", display: "flex", alignItems: "center",
            justifyContent: "center", overflow: "hidden", border: "2px solid #ddd",
          }}>
            {!avatarMode && preview ? (
              <img src={preview} alt="avatar preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : !avatarMode ? (
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="30" r="18" fill="#2E03A5" opacity="0.4"/>
                <ellipse cx="40" cy="65" rx="28" ry="16" fill="#2E03A5" opacity="0.4"/>
              </svg>
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: avatarColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {avatarStyle === "initials"
                  ? <span style={{ color: "white", fontSize: "52px", fontWeight: "bold", fontFamily: "Georgia" }}>
                      {name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </span>
                  : <span style={{ fontSize: "72px", lineHeight: 1 }}>🐊</span>
                }
              </div>
            )}
          </div>

          {/* Upload mode */}
          {!avatarMode && (
            <>
              <label style={labelStyle}>Profile Picture</label>
              <label style={{
                backgroundColor: "#2E03A5", color: "white", padding: "10px 24px",
                borderRadius: "4px", cursor: "pointer", fontSize: "14px", fontWeight: "600",
              }}>
                Choose File
                <input type="file" accept="image/*" onChange={handlePreview} style={{ display: "none" }} />
              </label>
              {image && <span style={{ fontSize: "12px", color: "#666" }}>{image.name}</span>}
            </>
          )}

          {/* Avatar mode */}
          {avatarMode && (
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "14px" }}>
                {[["initials", "Initials"], ["gator", "🐊 Gator"]].map(([val, label]) => (
                  <button key={val} onClick={() => setAvatarStyle(val)} style={{
                    padding: "8px 18px", borderRadius: "20px", border: "2px solid #2E03A5",
                    backgroundColor: avatarStyle === val ? "#2E03A5" : "transparent",
                    color: avatarStyle === val ? "white" : "#2E03A5",
                    cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "'Georgia', serif",
                  }}>{label}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                {AVATAR_COLORS.map(color => (
                  <div key={color} onClick={() => setAvatarColor(color)} style={{
                    width: "32px", height: "32px", borderRadius: "50%", backgroundColor: color,
                    cursor: "pointer",
                    border: avatarColor === color ? "3px solid #333" : "3px solid transparent",
                    transition: "border 0.15s",
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Minor + Certificate */}
      <div style={{
        backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "10px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.12)", padding: "28px 40px",
        width: "90%", maxWidth: "860px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px",
        marginBottom: "24px",
      }}>
        <div>
          <label style={labelStyle}>Minor(s)</label>
          {minors.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "4px" }}>
              <input style={{ ...inputStyle, flex: 1 }} type="text" value={m} placeholder="e.g. Mathematics" onChange={(e) => updateMinor(i, e.target.value)} />
              {minors.length > 1 && <button style={removeBtnStyle} onClick={() => removeMinor(i)}>×</button>}
            </div>
          ))}
          <button style={addBtnStyle} onClick={addMinor}>+ Add another minor</button>
        </div>
        <div>
          <label style={labelStyle}>Certificate(s)</label>
          {certificates.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "8px", gap: "4px" }}>
              <input style={{ ...inputStyle, flex: 1 }} type="text" value={c} placeholder="e.g. Cybersecurity" onChange={(e) => updateCert(i, e.target.value)} />
              {certificates.length > 1 && <button style={removeBtnStyle} onClick={() => removeCert(i)}>×</button>}
            </div>
          ))}
          <button style={addBtnStyle} onClick={addCert}>+ Add another certificate</button>
        </div>
      </div>

      {success && (
        <div style={{ backgroundColor: "#e6f4ea", border: "1px solid #a8d5b5", color: "#2d6a4f", borderRadius: "6px", padding: "12px 24px", marginBottom: "12px", fontSize: "15px", fontWeight: "600", width: "90%", maxWidth: "860px", textAlign: "center" }}>
          {isLoggedIn ? "Profile updated successfully!" : "Account created successfully!"}
        </div>
      )}
      {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>{error}</p>}

      <button onClick={handleOnSubmit} style={{
        width: "340px", height: "60px", backgroundColor: "transparent",
        border: "3px solid #F97000", color: "#F97000", fontSize: "22px",
        fontWeight: "bold", borderRadius: "4px", cursor: "pointer",
        marginBottom: "24px", letterSpacing: "1px", fontFamily: "'Georgia', serif",
      }}>
        {isLoggedIn ? "Update Profile" : "Sign Up"}
      </button>

      {!isLoggedIn && (
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "40px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2E03A5", fontWeight: "bold" }}>Login</Link>
        </p>
      )}
    </div>
  );
}