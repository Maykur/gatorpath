import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const inputStyle = {
  width: "100%", height: "44px", borderRadius: "4px",
  border: "1px solid #ccc", fontSize: "15px", padding: "0 12px",
  boxSizing: "border-box", backgroundColor: "#F7F8FA", outline: "none",
  fontFamily: "'Georgia', serif",
};

const labelStyle = {
  fontSize: "14px", fontWeight: "600", color: "#444",
  marginBottom: "6px", display: "block",
};

const fieldStyle = {
  display: "flex", flexDirection: "column", marginBottom: "18px",
};

const sectionTitle = {
  fontSize: "16px", fontWeight: "bold", color: "#2E03A5",
  letterSpacing: "1px", textTransform: "uppercase",
  borderBottom: "2px solid #F97000", paddingBottom: "8px",
  marginBottom: "20px", marginTop: "8px",
};

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

export default function ForwardSearchPage() {
  const navigate = useNavigate();

  const [majors, setMajors] = useState([]);
  const [majorId, setMajorId] = useState("");
  const [minor, setMinor] = useState("");
  const [certificate, setCertificate] = useState("");
  const [coursesTakenText, setCoursesTakenText] = useState("");
  const [expectedGraduationDate, setExpectedGraduationDate] = useState("");
  const [coursePreference, setCoursePreference] = useState("");
  const [searchName, setSearchName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (majors.length === 0) return;

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.log("No user found in localStorage");
        return;
      }

      const user = JSON.parse(storedUser);
      console.log("USER FROM LOCALSTORAGE:", user);

      const academic =
        user?.academic ||
        user?.academicPrograms ||
        user?.profile?.academic ||
        user;

      const userMajor =
        academic?.majorLabel ||
        academic?.major ||
        "";

      const userMinor = Array.isArray(academic?.minor)
        ? academic.minor.join(", ")
        : (academic?.minor || "");

      const userCertificate = Array.isArray(academic?.certificate)
        ? academic.certificate.join(", ")
        : (academic?.certificate || "");

      console.log("PREFILL VALUES:", {
        userMajor,
        userMinor,
        userCertificate,
      });

      setMinor(userMinor);
      setCertificate(userCertificate);

      const matchedMajor = majors.find(
        (m) => normalizeText(m.major) === normalizeText(userMajor)
      );

      console.log("MATCHED MAJOR:", matchedMajor);

      setMajorId(matchedMajor?._id || "");
    } catch (err) {
      console.error("Failed to prefill from localStorage:", err);
    }
  }, [majors]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!majorId) {
      setError("Please select a major.");
      return;
    }

    const token = localStorage.getItem("token");
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
        minor,
        certificate,
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

      navigate("/dashboard");
    } catch (err) {
      console.error("SEARCH SUBMIT ERROR:", err);
      setError(err.message || "Failed to submit search.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture,
      fontFamily: "'Georgia', serif", padding: "40px 5%",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          fontSize: "36px", fontWeight: "bold", color: "#2E03A5",
          letterSpacing: "4px", textTransform: "uppercase", margin: 0,
          textShadow: "1px 2px 6px rgba(180,180,200,0.4)",
        }}>
          Career Search
        </h1>
        <p style={{ color: "#888", fontSize: "14px", marginTop: "6px", letterSpacing: "1px" }}>
          Tell us about your academic background
        </p>
      </div>

      {error && <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}

      <div style={{
        backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "36px 40px",
        maxWidth: "700px",
      }}>
        <form onSubmit={onSubmit}>
          <div style={sectionTitle}>Section A: Academic Information</div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Major (required)</label>
            <select
              value={majorId}
              onChange={(e) => setMajorId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select a major</option>
              {majors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.major}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Minor</label>
              <input style={inputStyle} value={minor} onChange={(e) => setMinor(e.target.value)} placeholder="e.g. Mathematics" />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Certificate</label>
              <input style={inputStyle} value={certificate} onChange={(e) => setCertificate(e.target.value)} placeholder="e.g. Cybersecurity" />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Courses Taken (comma-separated codes)</label>
            <input
              style={inputStyle} placeholder="e.g., CIS4301, CIS4914"
              value={coursesTakenText} onChange={(e) => setCoursesTakenText(e.target.value)}
            />
          </div>

          <div style={sectionTitle}>Section B: Additional Information</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Expected Graduation</label>
              <input style={inputStyle} placeholder="e.g., Fall 2026" value={expectedGraduationDate} onChange={(e) => setExpectedGraduationDate(e.target.value)} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Course Preference</label>
              <input style={inputStyle} placeholder="e.g., Project Oriented" value={coursePreference} onChange={(e) => setCoursePreference(e.target.value)} />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Search Name (nickname)</label>
            <input style={inputStyle} placeholder="e.g., CS_with_DS_and_AI" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, height: "52px", backgroundColor: "transparent",
              border: "3px solid #F97000", color: "#F97000",
              fontSize: "18px", fontWeight: "bold", borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "'Georgia', serif", letterSpacing: "1px",
            }}>
              {submitting ? "Submitting..." : "Submit Search"}
            </button>
            <button type="button" onClick={() => navigate("/past-searches")} style={{
              height: "52px", padding: "0 24px", backgroundColor: "transparent",
              border: "2px solid #2E03A5", color: "#2E03A5",
              fontSize: "14px", fontWeight: "600", borderRadius: "4px",
              cursor: "pointer", fontFamily: "'Georgia', serif",
            }}>
              Past Searches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}