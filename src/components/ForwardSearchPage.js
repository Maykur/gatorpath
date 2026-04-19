import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

function parseCoursesTaken(text = "") {
  return text
    .split(",")
    .map((course) => course.trim())
    .filter(Boolean)
    .map((code) => ({ code }));
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getNextSemesters() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  let semesterIndex;
  if (month <= 4) semesterIndex = 0;      // Spring (Jan–May)
  else if (month <= 7) semesterIndex = 1; // Summer (Jun–Aug)
  else semesterIndex = 2;                 // Fall (Sep–Dec)

  const semesterOrder = ["Spring", "Summer", "Fall"];
  const semesters = [];
  let currentYear = year;
  let currentIndex = semesterIndex;

  for (let i = 0; i < 9; i++) {
    semesters.push(`${semesterOrder[currentIndex]} ${currentYear}`);
    currentIndex++;
    if (currentIndex >= semesterOrder.length) {
      currentIndex = 0;
      currentYear++;
    }
  }
  return semesters;
}

export default function ForwardSearchPage() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const navigate = useNavigate();

  const [majors, setMajors] = useState([]);
  const [majorId, setMajorId] = useState([]);
  const [minors, setMinors] = useState([]);
  const [certificates, setCerts] = useState([]);
  const [selectedMinors, setSelectedMinors] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [coursesTakenText, setCoursesTakenText] = useState("");
  const [expectedGraduationDate, setExpectedGraduationDate] = useState("");
  const [coursePreference, setCoursePreference] = useState("");
  const [searchName, setSearchName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Get minor and cert options from state
  const minorList = minors.map(n => ({ value: n._id, label: n.program_name }));
  const certList = certificates.map(c => ({ value: c._id, label: c.program_name }));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/majors`);
        const data = await res.json();
        setMajors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load majors.");
      }
    })();
  }, []);

  // Fetch Minors for dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/programs?type=Minor`);
        const data = await res.json();
        setMinors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load minors.");
      }
    })();
  }, []);

  // Fetch certificates for dropdown
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/programs?type=Certificate`);
        const data = await res.json();
        setCerts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load certificates.");
      }
    })();
  }, []);

  useEffect(() => {
    if (majors.length === 0 || minors.length === 0 || certificates.length === 0) return;

    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      const academic =
        user?.academic ||
        user?.academicPrograms ||
        user?.profile?.academic ||
        user;

      // Auto-populate major
      const userMajor = academic?.majorLabel || academic?.major || "";
      const matchedMajor = majors.find(
        (m) => normalizeText(m.major) === normalizeText(userMajor)
      );
      if (matchedMajor) setMajorId(matchedMajor._id);

      // Auto-populate minors
      const userMinors = Array.isArray(academic?.minor)
        ? academic.minor
        : academic?.minor ? [academic.minor] : [];
      const matchedMinors = minors
        .filter(m => userMinors.some(um => normalizeText(um) === normalizeText(m.program_name)))
        .map(m => ({ value: m._id, label: m.program_name }));
      if (matchedMinors.length > 0) setSelectedMinors(matchedMinors);

      // Auto-populate certificates
      const userCerts = Array.isArray(academic?.certificate)
        ? academic.certificate
        : academic?.certificate ? [academic.certificate] : [];
      const matchedCerts = certificates
        .filter(c => userCerts.some(uc => normalizeText(uc) === normalizeText(c.program_name)))
        .map(c => ({ value: c._id, label: c.program_name }));
      if (matchedCerts.length > 0) setSelectedCerts(matchedCerts);

      // Auto-populate courses
      const userCourses = Array.isArray(academic?.coursesTaken)
        ? academic.coursesTaken.map(c => c.code || c).join(", ")
        : (academic?.coursesTaken || "");
      if (userCourses) setCoursesTakenText(userCourses);

      // Auto-populate graduation
      const userGrad =
        user?.additional?.expectedGraduationDate ||
        academic?.expectedGraduationDate || "";
      if (userGrad) setExpectedGraduationDate(userGrad);

    } catch (err) {
      console.error("Failed to prefill from sessionStorage:", err);
    }
  }, [majors, minors, certificates]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!majorId) {
      setError("Please select a major.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("You must be logged in.");
      navigate("/login");
      return;
    }

    const selectedMajor = majors.find((m) => m._id === majorId);

    const payload = {
      searchName,
      academic: {
        majorId,
        majorLabel: selectedMajor?.major || "",
        minor: selectedMinors.map(m => m.label).join(", "),
        certificate: selectedCerts.map(c => c.label).join(", "),
        coursesTaken: parseCoursesTaken(coursesTakenText),
      },
      additional: {
        expectedGraduationDate,
        coursePreference,
      },
    };

    try {
      setSubmitting(true);

      const res = await fetch(`${baseUrl}/searches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit search.");
      }

      const params = new URLSearchParams();
      const selectedMajor = majors.find(m => m._id === majorId);
      if (selectedMajor) {
          const simplifiedMajor = selectedMajor.major.split("(")[0].split("-")[0].trim();
          params.append("major", simplifiedMajor);
      }
      if (selectedMinors.length > 0) params.append("minor", selectedMinors.map(m => m.label).join(","));
      if (selectedCerts.length > 0) params.append("certificate", selectedCerts.map(c => c.label).join(","));
      if (coursesTakenText) params.append("skills", coursesTakenText);
      navigate("/dashboard");
    } catch (err) {
      console.error("SEARCH SUBMIT ERROR:", err);
      setError(err.message || "Failed to submit search.");
    } finally {
      setSubmitting(false);
    }
  }

  // Dynamic styles using theme
  const inputStyle = {
    width: "100%", height: "44px", borderRadius: "4px",
    border: `1px solid ${t.border}`, fontSize: "15px", padding: "0 12px",
    boxSizing: "border-box", backgroundColor: t.inputBg, outline: "none",
    fontFamily: "'Georgia', serif", color: t.text,
  };

  const labelStyle = {
    fontSize: "14px", fontWeight: "600", color: t.textMuted,
    marginBottom: "6px", display: "block",
  };

  const fieldStyle = {
    display: "flex", flexDirection: "column", marginBottom: "18px",
  };

  const sectionTitle = {
    fontSize: "16px", fontWeight: "bold", color: t.accent,
    textAlign: "center",
    letterSpacing: "1px", textTransform: "uppercase",
    borderBottom: `2px solid ${t.orange}`, paddingBottom: "8px",
    marginBottom: "20px", marginTop: "8px",
  };

  // react-select custom styles for dark mode
  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1e1e32" : "#ffffff",
      borderColor: t.border,
      color: t.text,
      fontFamily: "'Georgia', serif",
      minHeight: "44px",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#1e1e32" : "#ffffff",
      border: `1px solid ${t.border}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? (isDark ? "#2e2e50" : "#f0ecff")
        : (isDark ? "#1e1e32" : "#ffffff"),
      color: t.text,
      fontFamily: "'Georgia', serif",
    }),
    singleValue: (base) => ({ ...base, color: t.text }),
    multiValue: (base) => ({ ...base, backgroundColor: isDark ? "#2e2e50" : "#ede9ff" }),
    multiValueLabel: (base) => ({ ...base, color: t.text }),
    multiValueRemove: (base) => ({ ...base, color: t.textMuted }),
    placeholder: (base) => ({ ...base, color: t.textLight }),
    input: (base) => ({ ...base, color: t.text }),
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: t.bg,
      backgroundImage: texture,
      fontFamily: "'Georgia', serif",
      display: "flex",
      justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: "800px", padding: "40px 20px" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{
            fontSize: "36px", fontWeight: "bold", color: t.accent,
            letterSpacing: "4px", textTransform: "uppercase",
            margin: 0, textShadow: "1px 2px 6px rgba(180,180,200,0.4)",
            textAlign: "center",
          }}>
            Career Search
          </h1>
          <p style={{
            color: t.textMuted, fontSize: "14px", letterSpacing: "1px",
            marginTop: "6px", textAlign: "center",
          }}>
            Tell us about your academic background
          </p>
          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "6px" }}>
            <Link to="/dashboard" style={{ color: t.accent, fontSize: "14px" }}>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* FORM BOX - make it more opaque */}
        <div style={{
          backgroundColor: isDark ? "rgba(30,30,50,0.97)" : "rgba(255,255,255,0.97)",
          borderRadius: "10px",
          boxShadow: t.shadow,
          padding: "36px 40px",
          width: "100%",
          border: `1px solid ${t.border}`,
        }}>
          <form onSubmit={onSubmit}>
            <div style={sectionTitle}>Academic Information</div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Major <span style={{ color: t.orange }}>*</span></label>
              <Select
                options={majors.map(m => ({ value: m._id, label: m.major }))
                }
                value={majors.map(m => ({ value: m._id, label: m.major })).find(o => o.value === majorId) || null}
                onChange={(selected) => setMajorId(selected ? selected.value : "")}
                placeholder="Select a Major"
                styles={selectStyles}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Minor (Select Multiple)</label>
                <Select
                  isMulti
                  options={minorList}
                  value={selectedMinors}
                  onChange={(selected) => {
                    setSelectedMinors(selected || []);
                  }}
                  placeholder="e.g., Mathematics"
                  styles={selectStyles}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Certificate (Select Multiple)</label>
                <Select
                  isMulti
                  options={certList}
                  value={selectedCerts}
                  onChange={(selected) => {
                    setSelectedCerts(selected || []);
                  }}
                  placeholder="e.g., Cybersecurity"
                  styles={selectStyles}
                />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Courses Taken (Comma-Separated Codes)</label>
              <input
                style={inputStyle} placeholder="e.g., CIS4301, CIS4914"
                value={coursesTakenText} onChange={(e) => setCoursesTakenText(e.target.value)}
              />
            </div>

            <div style={sectionTitle}>Additional Information</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Expected Graduation</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer", appearance: "auto" }}
                  value={expectedGraduationDate}
                  onChange={(e) => setExpectedGraduationDate(e.target.value)}
                >
                  <option value="">Select Graduation Semester</option>
                  {getNextSemesters().map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Course Preference</label>
                <input style={inputStyle} placeholder="e.g., Project Oriented" value={coursePreference} onChange={(e) => setCoursePreference(e.target.value)} />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Search Name (Nickname)</label>
              <input style={inputStyle} placeholder="e.g., CS_with_DS_and_AI" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </div>

            {error && <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", marginTop: "18px" }}>
              <button
                type="button"
                onClick={() => navigate("/past-searches")}
                style={{
                  border: `2px solid ${t.accent}`,
                  background: isDark ? "rgba(46,3,165,0.2)" : "rgba(46,3,165,0.08)",
                  color: t.accent,
                  borderRadius: "6px", padding: "12px 16px",
                  fontSize: "20px", fontWeight: "700",
                  fontFamily: "'Georgia', serif", cursor: "pointer",
                }}
              >
                Past Searches
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  border: `2px solid ${t.orange}`,
                  background: isDark ? "rgba(249,112,0,0.15)" : "rgba(249,112,0,0.08)",
                  color: t.orange,
                  borderRadius: "6px", padding: "12px 16px",
                  fontSize: "20px", fontWeight: "700",
                  fontFamily: "'Georgia', serif", cursor: "pointer",
                }}
              >
                {submitting ? "Submitting..." : "Submit Search"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}