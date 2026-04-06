import React, { useEffect, useState} from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import {Link} from "react-router-dom";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const inputStyle = {
  width: "100%", height: "44px", borderRadius: "4px",
  border: "1px solid #ccc", fontSize: "15px", padding: "0 12px",
  boxSizing: "border-box", backgroundColor: "#ffffff", outline: "none",
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
  const [majorId, setMajorId] = useState([]);
  const [minors, setMinors] = useState([]);
  const [certificates, setCerts] = useState([]);
  const [minorIds, setMinorIds] = useState([]);
  const [certificateIds, setCertificateIds] = useState([]);
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
        } 
        catch (err) {
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
        } 
        catch (err) {
            console.error(err);
            setError("Failed to load certificates.");
        }
        })();
    }, []);

  useEffect(() => {
    if (majors.length === 0) return;

    try {
      const storedUser = sessionStorage.getItem("user");
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

      // setMinor(userMinor);
      // setCertificate(userCertificate);

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
return (
<div style={{
  minHeight: "100vh",
  backgroundColor: "#FAF3EA",
  backgroundImage: texture,
  fontFamily: "'Georgia', serif",
  display: "flex",
  justifyContent: "center"
}}>

  <div style={{
    width: "100%",
    maxWidth: "800px",
    padding: "40px 20px"
  }}>

    {/* HEADER */}
    <div style={{ marginBottom: "20px" }}>

      <h1 style={{
        fontSize: "36px",
        fontWeight: "bold",
        color: "#2E03A5",
        letterSpacing: "4px",
        textTransform: "uppercase",
        margin: 0,
        textShadow: "1px 2px 6px rgba(180,180,200,0.4)",
        textAlign: "center"
      }}>
        Career Search
      </h1>

      <p style={{
        color: "#888",
        fontSize: "14px",
        letterSpacing: "1px",
        marginTop: "6px",
        textAlign: "center"
      }}>
        Tell us about your academic background
      </p>

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "6px"
      }}>
        <Link to="/dashboard">
          Back to Dashboard
        </Link>
        </div>
  </div>


    {/* FORM BOX */}
    <div style={{
      backgroundColor: "rgba(255,255,255,0.6)",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      padding: "36px 40px",
      width: "100%"  
    }}>
        <form onSubmit={onSubmit}>
          <div style={sectionTitle}>Academic Information</div>



          <div style={fieldStyle}>
            <label style={labelStyle}>Major (required)</label>
            <Select
              options={majors.map(m => ({ value: m._id, label: m.major }))}

              value={majors.map(m => ({ value: m._id, label: m.major })).find(o => o.value === majorId) || null}
              onChange={(selected) => setMajorId(selected ? selected.value : "")}
              style={inputStyle}
              placeholder="Select a Major"
              />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Minor (Select Multiple)</label>
                <Select
                    isMulti
                    style = {fieldStyle}
                    options={minorList}
                    onChange={(selected) => {
                        setSelectedMinors(selected || []);
                        setMinorIds((selected || []).map(s => s.value));
                    }}
                    placeholder="e.g., Mathematics"
                />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Certificate (Select Multiple)</label>
                <Select
                    isMulti
                    options={certList}
                    onChange={(selected) => {
                        setSelectedCerts(selected || []);
                        setCertificateIds((selected || []).map(s => s.value));
                    }}
                    placeholder="e.g., Cybersecurity"
                />
            </div>
            
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Courses Taken (comma-separated codes)</label>
            <input
              style={inputStyle} placeholder="e.g., CIS4301, CIS4914"
              value={coursesTakenText} onChange={(e) => setCoursesTakenText(e.target.value)}
            />
          </div>

          <div style={sectionTitle}>Additional Information</div>

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

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginTop: "18px" }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                border: "2px solid #F97000",
                background: "white",
                color: "#F97000",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "20px",
                fontWeight: "700",
                fontFamily: "'Georgia', serif",
                cursor: "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submit Search"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/past-searches")}
              style={{
                border: "2px solid #2E03A5",
                background: "white",
                color: "#2E03A5",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "20px",
                fontWeight: "700",
                fontFamily: "'Georgia', serif",
                cursor: "pointer",
              }}
            >
              Past Searches
            </button>
          </div>
        </form>
      </div>
            </div>
            </div>


);

}