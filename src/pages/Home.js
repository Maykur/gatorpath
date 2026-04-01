import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import StarButtonToggle from "../components/StarButtonToggle"; 
import { baseUrl } from "../constants";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const MOCK_CAREERS = [
  { title: "Cyber Security: Analyst", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 70000, rangeMin: 40000, rangeMax: 100000 },
  { title: "Cloud Security Engineer", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 90000, rangeMin: 60000, rangeMax: 120000 },
  { title: "Software Engineer", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 95000, rangeMin: 40000, rangeMax: 150000 },
];

const MOCK_RESOURCES = [
  "Coursera – IBM Data Engineering Professional Certificate",
  "Data Engineering Zoomcamp",
  '"Fundamentals of Data Engineering" by Reis & Housley',
  "Data Engineering Weekly Newsletter",
];

const MOCK_EXTRACURRICULARS = ["Languages to Master", "Platforms to Utilize", "Certifications/Courses to Find"];

const TABS = ["Career Information", "Learning Pathways", "CISE Majors"];

const colStyle = {
  backgroundColor: "rgba(255,255,255,0.7)",
  borderRadius: "6px",
  padding: "24px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  minHeight: "500px",
};

const colHeaderStyle = {
  fontSize: "16px", fontWeight: "bold", textAlign: "center",
  marginBottom: "16px", color: "#111", lineHeight: "1.4",
};

function SalaryBar({ min, max, overall }) {
  const pct = (v) => Math.round(((v - overall.min) / (overall.max - overall.min)) * 100);
  return (
    <div style={{ position: "relative", height: "6px", backgroundColor: "#ddd", borderRadius: "3px", margin: "8px 0" }}>
      <div style={{
        position: "absolute", left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%`,
        height: "100%", backgroundColor: "#2E03A5", borderRadius: "3px",
      }} />
      <div style={{ position: "absolute", left: `${pct(min)}%`, top: "-4px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#2E03A5", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: `${pct(max)}%`, top: "-4px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#2E03A5", transform: "translateX(-50%)" }} />
    </div>
  );
}

const MOCK_LANGUAGES = ["SQL", "Python", "Scala/Java", "Bash/Shell"];
const MOCK_PLATFORMS = [
  { name: "Apache Spark & Airflow", desc: "data processing & orchestration" },
  { name: "Snowflake/ BigQuery", desc: "data warehousing" },
  { name: "Kafka", desc: "data streaming" },
  { name: "Git / Docker / Terraform", desc: "DevOps and infrastructure" },
];
const MOCK_CERTS = [
  "AWS Certified Data Engineer",
  "Google Data Analytics Certificate",
  "DASCA Associate Big Data Engineer",
];

function LearningPathways() {
  const [showNote, setShowNote] = useState(true);

  return (
    <div style={{ padding: "0 28px 40px", position: "relative" }}>
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Main content */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#111", marginBottom: "20px" }}>
            Proposed Resources for Specified Career:
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
            {MOCK_RESOURCES.map((r, i) => (
              <div key={i} style={{
                border: "1px solid #ccc", borderRadius: "4px", padding: "12px 18px",
                fontSize: "14px", color: "#2E03A5", fontStyle: "italic",
                backgroundColor: "rgba(255,255,255,0.7)", maxWidth: "500px",
                cursor: "pointer",
              }}>{r}</div>
            ))}
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111", marginBottom: "20px" }}>
            Extracurriculars:
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {/* Languages */}
            <div>
              <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: "14px", fontSize: "14px" }}>
                Languages to Master:
              </div>
              {MOCK_LANGUAGES.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #555", flexShrink: 0 }} />
                  {l}
                </div>
              ))}
            </div>

            {/* Platforms */}
            <div>
              <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: "14px", fontSize: "14px" }}>
                Platforms to Utilize:
              </div>
              {MOCK_PLATFORMS.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px", fontSize: "14px" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #555", flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>{p.name}</strong> <span style={{ fontSize: "12px", color: "#777" }}>- {p.desc}</span></span>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: "14px", fontSize: "14px" }}>
                Certifications to Add:
              </div>
              {MOCK_CERTS.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #555", flexShrink: 0 }} />
                  <strong>{c}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dismissable note popup */}
        {showNote && (
          <div style={{
            width: "220px", flexShrink: 0,
            backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid #ddd",
            borderRadius: "8px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            position: "relative", fontSize: "13px",
          }}>
            <button onClick={() => setShowNote(false)} style={{
              position: "absolute", top: "8px", right: "10px",
              background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#888",
            }}>✕</button>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>ⓘ</span>
              <strong style={{ fontSize: "13px", lineHeight: "1.4" }}>Note: These resources are proposed to be directly correlated to potential careers</strong>
            </div>
            <p style={{ color: "#555", lineHeight: "1.5", marginBottom: "12px" }}>
              You may also manually add your extracurricular activities. These experiences can help you land different job opportunities!
            </p>
            <button onClick={() => setShowNote(false)} style={{
              backgroundColor: "#2E03A5", color: "white", border: "none",
              borderRadius: "4px", padding: "6px 16px", cursor: "pointer",
              fontSize: "13px", fontFamily: "'Georgia', serif",
            }}>Great!</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Home() {
  const [latest, setLatest] = useState(null);
  const [activeTab, setActiveTab] = useState(-1);
  const [majorData, setMajorData] = useState(null);
  const [allMajors, setAllMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadLatest() {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      const res = await fetch(`http://${baseUrl}/searches/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setLatest(data);
    }
    loadLatest();
    if (location.state?.activeSearch) setLatest(location.state.activeSearch);
    if (location.state?.resetTab) setActiveTab(-1);
  }, [location.state]);


  // Fetch user's major for col 3
  useEffect(() => {
    if (!latest?.academic?.majorId) return;
    async function loadMajor() {
      try {
        const res = await fetch(`http://${baseUrl}/majors/${latest.academic.majorId}`);
        const data = await res.json();
        setMajorData(data);
      } catch (err) { console.error(err); }
    }
    loadMajor();
  }, [latest]);

  // Fetch all majors
  useEffect(() => {
    async function loadAllMajors() {
      try {
        const res = await fetch(`http://${baseUrl}/majors`);
        const data = await res.json();
        setAllMajors(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    }
    loadAllMajors();
  }, []);

  // When CISE Majors tab opens, auto-select user's major
  useEffect(() => {
    if (activeTab !== 2) return;
    if (!latest?.academic?.majorId) return;
    async function autoLoad() {
      try {
        const res = await fetch(`http://${baseUrl}/majors/${latest.academic.majorId}`);
        const data = await res.json();
        setSelectedMajor(data);
      } catch (err) { console.error(err); }
    }
    autoLoad();
  }, [activeTab, latest]);

  async function handleSelectMajor(id) {
    if (selectedMajor?._id === id) { setSelectedMajor(null); return; }
    try {
      const res = await fetch(`http://${baseUrl}/majors/${id}`);
      const data = await res.json();
      setSelectedMajor(data);
    } catch (err) { console.error(err); }
  }

  const salaryOverall = { min: 0, max: 200000 };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture, fontFamily: "'Georgia', serif", paddingTop: "80px" }}>

      {/* Tabs + actions row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px 14px 28px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              padding: "8px 20px", borderRadius: "20px", border: "1px solid #bbb",
              backgroundColor: activeTab === i ? "#2E03A5" : "rgba(255,255,255,0.7)",
              color: activeTab === i ? "white" : "#333",
              fontWeight: activeTab === i ? "600" : "400",
              cursor: "pointer", fontSize: "14px", fontFamily: "'Georgia', serif",
            }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <StarButtonToggle search={latest} onUpdated={(updated) => setLatest(updated)} />
          <Link to="/search" style={{ textDecoration: "none" }}>
            <button style={{
              backgroundColor: "#F97000", color: "white", border: "none",
              borderRadius: "24px", padding: "12px 28px", fontSize: "16px",
              fontWeight: "bold", cursor: "pointer", fontFamily: "'Georgia', serif",
              boxShadow: "0 3px 10px rgba(249,112,0,0.35)",
            }}>Search Page</button>
          </Link>
        </div>
      </div>

      {/* ── DEFAULT HOME DASHBOARD (3 columns) ── */}
      {activeTab === -1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", padding: "0 28px 40px" }}>
          {/* Col 1: Career Paths */}
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>Career Paths Based on the Information You Entered</h3>
            <p style={{ fontSize: "13px", color: "#777", marginBottom: "20px", fontStyle: "italic" }}>By Best Match</p>
            {MOCK_CAREERS.map((c, i) => (
              <div key={i} style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: "bold", fontSize: "14px", borderBottom: "2px solid #333", paddingBottom: "4px", marginBottom: "6px", display: "inline-block" }}>{c.title}</div>
                <p style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: "1.5" }}>{c.description}</p>
              </div>
            ))}
          </div>

          {/* Col 2: Resources + Extracurriculars */}
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>Proposed Resources for Specified Career:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {MOCK_RESOURCES.map((r, i) => (
                <div key={i} style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "10px 14px", fontSize: "13px", color: "#2E03A5", fontStyle: "italic", backgroundColor: "rgba(255,255,255,0.6)" }}>{r}</div>
              ))}
            </div>
            <h3 style={colHeaderStyle}>Extracurriculars:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {MOCK_EXTRACURRICULARS.map((e, i) => (
                <div key={i} style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "10px 14px", fontSize: "13px", fontStyle: "italic", backgroundColor: "rgba(255,255,255,0.6)" }}>{e}</div>
              ))}
            </div>
          </div>

          {/* Col 3: CISE Majors courses from DB */}
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>CISE Majors</h3>

            {/* User's search info */}
            {latest && (
              <div style={{
                backgroundColor: "rgba(46,3,165,0.06)", borderRadius: "6px",
                padding: "10px 14px", marginBottom: "16px", fontSize: "13px",
                color: "#444", borderLeft: "3px solid #2E03A5",
              }}>
                <div><strong>Major:</strong> {latest.academic?.majorLabel || "—"}</div>
                {latest.academic?.minor && <div><strong>Minor:</strong> {latest.academic.minor}</div>}
                {latest.academic?.certificate && <div><strong>Certificate:</strong> {latest.academic.certificate}</div>}
              </div>
            )}

            {!majorData && (
              <p style={{ color: "#999", fontSize: "13px", textAlign: "center" }}>Submit a search to see your major's courses here.</p>
            )}
            {majorData && (
              <>
                {majorData.core_coursework?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#2E03A5", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Core Coursework</div>
                    {majorData.core_coursework.slice(0, 4).map((c, i) => (
                      <div key={i} style={{ marginBottom: "8px", paddingLeft: "8px", borderLeft: "2px solid #2E03A5" }}>
                        <span style={{ fontWeight: "bold", fontSize: "13px", color: "#2E03A5" }}>{c.code}</span>
                        <span style={{ fontSize: "13px", color: "#444" }}> — {c.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {majorData.required_foundation?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#F97000", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Required Foundation</div>
                    {majorData.required_foundation.slice(0, 4).map((c, i) => (
                      <div key={i} style={{ marginBottom: "8px", paddingLeft: "8px", borderLeft: "2px solid #F97000" }}>
                        <span style={{ fontWeight: "bold", fontSize: "13px", color: "#F97000" }}>{c.code}</span>
                        <span style={{ fontSize: "13px", color: "#444" }}> — {c.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {majorData.elective_areas?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Elective Areas</div>
                    {majorData.elective_areas.slice(0, 4).map((area, i) => (
                      <div key={i} style={{ marginBottom: "6px", paddingLeft: "8px", borderLeft: "2px solid #aaa", fontSize: "13px", color: "#444" }}>{area}</div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CAREER INFORMATION TAB ── */}
      {activeTab === 0 && (
        <div style={{ padding: "0 28px 40px" }}>
          <div style={{ ...colStyle, minHeight: "unset" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "bold", textAlign: "center", color: "#111", marginBottom: "6px" }}>
              Career Paths Based on the Information You Entered
            </h2>
            <p style={{ textAlign: "center", fontWeight: "bold", color: "#333", marginBottom: "32px" }}>By Best Match</p>

            {MOCK_CAREERS.map((c, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr",
                gap: "32px", alignItems: "center",
                borderBottom: i < MOCK_CAREERS.length - 1 ? "1px solid #eee" : "none",
                paddingBottom: "24px", marginBottom: "24px",
              }}>
                {/* Left: title + description */}
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "17px", color: "#111", marginBottom: "8px" }}>{c.title}</div>
                  <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{c.description}</div>
                </div>
                {/* Middle: avg salary */}
                <div>
                  <span style={{ fontSize: "30px", fontWeight: "bold", color: "#111" }}>
                    ${c.avg.toLocaleString()}
                  </span>
                  <span style={{ fontSize: "12px", color: "#888" }}> / avg. per year</span>
                </div>
                {/* Right: salary range bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "2px" }}>
                    <span>Annual Salary Range</span>
                    <span>${(c.rangeMin / 1000).toFixed(0)}K–{(c.rangeMax / 1000).toFixed(0)}K</span>
                  </div>
                  <SalaryBar min={c.rangeMin} max={c.rangeMax} overall={salaryOverall} />
                  <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>Range Based on Your Area</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LEARNING PATHWAYS TAB ── */}
      {activeTab === 1 && (
        <LearningPathways />
      )}

      {/* ── CISE MAJORS TAB ── */}
      {activeTab === 2 && (
        <div style={{ padding: "0 28px 40px" }}>
          {/* User info banner */}
          {latest && (
            <div style={{
              backgroundColor: "rgba(46,3,165,0.06)", borderRadius: "6px",
              padding: "14px 18px", marginBottom: "20px", fontSize: "13px",
              color: "#444", borderLeft: "4px solid #2E03A5",
              display: "flex", gap: "24px", flexWrap: "wrap",
            }}>
              <div><strong>Major:</strong> {latest.academic?.majorLabel || "—"}</div>
              {latest.academic?.minor && <div><strong>Minor:</strong> {latest.academic.minor}</div>}
              {latest.academic?.certificate && <div><strong>Certificate:</strong> {latest.academic.certificate}</div>}
              {latest.academic?.coursesTaken?.length > 0 && <div><strong>Courses Taken:</strong> {latest.academic.coursesTaken.map(c => c.code).join(", ")}</div>}
              {latest.additional?.expectedGraduationTerm && <div><strong>Graduating:</strong> {latest.additional.expectedGraduationTerm}</div>}
            </div>
          )}

          {/* 4 major cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {allMajors.map((m) => (
              <div key={m._id} onClick={() => handleSelectMajor(m._id)} style={{
                backgroundColor: selectedMajor?._id === m._id ? "rgba(46,3,165,0.08)" : "rgba(255,255,255,0.7)",
                border: selectedMajor?._id === m._id ? "2px solid #2E03A5" : "2px solid transparent",
                borderRadius: "6px", padding: "20px", cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "all 0.2s",
              }}>
                <div style={{ fontWeight: "bold", fontSize: "15px", color: "#2E03A5", marginBottom: "4px" }}>{m.major}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{m.university}</div>
              </div>
            ))}
          </div>

          {/* Full catalog below */}
          {selectedMajor && (
            <div style={{ ...colStyle, minHeight: "unset" }}>
              <h3 style={{ ...colHeaderStyle, fontSize: "20px", marginBottom: "24px" }}>{selectedMajor.major}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>

                {selectedMajor.core_coursework?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#2E03A5", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", borderBottom: "2px solid #2E03A5", paddingBottom: "4px" }}>Core Coursework</div>
                    {selectedMajor.core_coursework.map((c, i) => (
                      <div key={i} style={{ fontSize: "13px", color: "#444", paddingLeft: "8px", borderLeft: "2px solid #2E03A5", marginBottom: "8px" }}>
                        <strong style={{ color: "#2E03A5" }}>{c.code}</strong> — {c.title}
                      </div>
                    ))}
                  </div>
                )}

                {selectedMajor.required_foundation?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#F97000", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", borderBottom: "2px solid #F97000", paddingBottom: "4px" }}>Required Foundation</div>
                    {selectedMajor.required_foundation.map((c, i) => (
                      <div key={i} style={{ fontSize: "13px", color: "#444", paddingLeft: "8px", borderLeft: "2px solid #F97000", marginBottom: "8px" }}>
                        <strong style={{ color: "#F97000" }}>{c.code}</strong> — {c.title}
                      </div>
                    ))}
                  </div>
                )}

                {selectedMajor.elective_areas?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", borderBottom: "2px solid #aaa", paddingBottom: "4px" }}>Elective Areas</div>
                    {selectedMajor.elective_areas.map((area, i) => (
                      <div key={i} style={{ fontSize: "13px", color: "#444", paddingLeft: "8px", borderLeft: "2px solid #aaa", marginBottom: "8px" }}>{area}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}