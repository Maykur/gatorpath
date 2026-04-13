import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarButtonToggle from "../components/StarButtonToggle";
import {baseUrl} from "../constants";
import {Tab} from "../App.js";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const MOCK_CAREERS = [
  { title: "Cyber Security: Analyst", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 70000, rangeMin: 40000, rangeMax: 100000 },
  { title: "Cloud Security Engineer", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 90000, rangeMin: 60000, rangeMax: 120000 },
  { title: "Software Engineer", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 95000, rangeMin: 40000, rangeMax: 150000 },
];

const TABS = ["Career Information", "Learning Pathways", "CISE Majors"];

const colStyle = {
  backgroundColor: "rgba(255,255,255,0.7)",
  borderRadius: "6px", padding: "24px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)", minHeight: "500px",
};

const colHeaderStyle = {
  fontSize: "16px", fontWeight: "bold", textAlign: "center",
  marginBottom: "16px", color: "#111", lineHeight: "1.4",
};

const salaryOverall = { min: 0, max: 200000 };

// Format salary if its not a range
function formatSalary(salary) {
  if (!salary || salary === "N/A") return "N/A";

  const parts = salary.split("-").map((part) => part.trim());
  if (parts.length === 2 && parts[0] === parts[1]) {
    return parts[0];
  }

  return salary;
}

function SalaryBar({ min, max, overall }) {
  const pct = (v) => Math.round(((v - overall.min) / (overall.max - overall.min)) * 100);
  return (
    <div style={{ position: "relative", height: "6px", backgroundColor: "#ddd", borderRadius: "3px", margin: "8px 0" }}>
      <div style={{ position: "absolute", left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%`, height: "100%", backgroundColor: "#2E03A5", borderRadius: "3px" }} />
      <div style={{ position: "absolute", left: `${pct(min)}%`, top: "-4px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#2E03A5", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: `${pct(max)}%`, top: "-4px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#2E03A5", transform: "translateX(-50%)" }} />
    </div>
  );
}

// Learning Pathways function that implements seeded data recommendation system
function LearningPathways({ learningData, loading }) {
  const [showNote, setShowNote] = useState(true);
  const languages = learningData?.languages || [];
  const platforms = learningData?.platforms || [];
  const certifications = learningData?.certifications || [];
  const resources = learningData?.resources || [];
  const youtubeResources = learningData?.youtubeResources || [];
  return (
    <div style={{ padding: "0 28px 40px", position: "relative" }}>
      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#111", marginBottom: "20px" }}>Proposed Resources for Specified Career:</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            <div>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px 16px",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  fontStyle: "italic",
                  marginBottom: "14px",
                  fontSize: "14px",
                }}
              >
                Recommended Resources
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loading ? (
                  <p style={{ color: "#777" }}>Loading recommended resources...</p>
                ) : resources.length ? (
                  resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "12px 18px",
                        fontSize: "14px",
                        color: "#2E03A5",
                        fontStyle: "italic",
                        backgroundColor: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      {r.provider} — {r.title}
                    </a>
                  ))
                ) : (
                  <div style={{ color: "#777", fontSize: "14px" }}>No recommended resources found yet.</div>
                )}
              </div>
            </div>
            <div>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px 16px",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  fontStyle: "italic",
                  marginBottom: "14px",
                  fontSize: "14px",
                }}
              >
                YouTube Searches
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loading ? (
                  <p style={{ color: "#777" }}>Loading YouTube searches...</p>
                ) : youtubeResources.length ? (
                  youtubeResources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "12px 18px",
                        fontSize: "14px",
                        color: "#2E03A5",
                        fontStyle: "italic",
                        backgroundColor: "rgba(255,255,255,0.7)",
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "block",
                      }}
                    >
                      {r.provider} — {r.title}
                    </a>
                  ))
                ) : (
                  <div style={{ color: "#777", fontSize: "14px" }}>No YouTube searches found yet.</div>
                )}
              </div>
            </div>
            </div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111", marginBottom: "20px" }}>Extracurriculars:</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            <div>
              <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: "14px", fontSize: "14px" }}>Languages to Master:</div>
              {languages.length ? (
                languages.map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #555", flexShrink: 0 }} />
                    {l}
                  </div>
                ))
              ) : (
                <div style={{ color: "#777", fontSize: "13px" }}>No language suggestions yet.</div>
              )}
            </div>

            <div>
              <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: "14px", fontSize: "14px" }}>Platforms to Utilize:</div>
              {platforms.length ? (
                platforms.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #555", flexShrink: 0 }} />
                    {p}
                  </div>
                ))
              ) : (
                <div style={{ color: "#777", fontSize: "13px" }}>No platform suggestions yet.</div>
              )}
            </div>

            <div>
              <div style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px 16px", backgroundColor: "rgba(255,255,255,0.7)", fontStyle: "italic", marginBottom: "14px", fontSize: "14px" }}>Certifications to Add:</div>
              {certifications.length ? (
                certifications.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #555", flexShrink: 0 }} />
                    <strong>{c}</strong>
                  </div>
                ))
              ) : (
                <div style={{ color: "#777", fontSize: "13px" }}>No certification suggestions yet.</div>
              )}
            </div>
          </div>
        </div>

        {showNote && (
          <div style={{ width: "220px", flexShrink: 0, backgroundColor: "rgba(255,255,255,0.9)", border: "1px solid #ddd", borderRadius: "8px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", position: "relative", fontSize: "13px" }}>
            <button onClick={() => setShowNote(false)} style={{ position: "absolute", top: "8px", right: "10px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#888" }}>✕</button>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>ℹ</span>
              <strong style={{ fontSize: "13px", lineHeight: "1.4" }}>Note: These resources are proposed to be directly correlated to potential careers</strong>
            </div>
            <p style={{ color: "#555", lineHeight: "1.5", marginBottom: "12px" }}>You may also manually add your extracurricular activities. These experiences can help you land different job opportunities!</p>
            <button onClick={() => setShowNote(false)} style={{ backgroundColor: "#2E03A5", color: "white", border: "none", borderRadius: "4px", padding: "6px 16px", cursor: "pointer", fontSize: "13px", fontFamily: "'Georgia', serif" }}>Great!</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {activeTab, setActiveTab} = useContext(Tab);
  const [majorData, setMajorData] = useState(null);
  const [allMajors, setAllMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [jobListings, setJobListings] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [learningData, setLearningData] = useState(null);
  const [learningLoading, setLearningLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const activeSearch = location.state?.activeSearch;
        if (!token) { navigate("/"); return; }

        const endpoint = activeSearch?._id
          ? `${baseUrl}/dashboard/${activeSearch._id}`
          : `${baseUrl}/dashboard/latest`;

        const response = await fetch(endpoint, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) { navigate("/search"); return; }
        if (!response.ok) throw new Error(`Error fetching dashboard data: ${response.statusText}`);

        const data = await response.json();
        setSearchData(data.search);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    if (location.state?.resetTab) setActiveTab(-1);
  }, [location.state, navigate]);

  // Fetch job listings when searchData loads
  useEffect(() => {
    if (!searchData?.academic?.majorLabel) return;
    if (searchData.current) return;
    async function loadJobListings() {
      setJobsLoading(true);
      try {
        const params = new URLSearchParams({
          major: searchData.academic.majorLabel || "",
          minor: searchData.academic.minor || "",
          certificate: searchData.academic.certificate || "",
          state: "Florida",
        });
        const res = await fetch(`${baseUrl}/jobListings?${params}`);
        const data = await res.json();
        if (res.ok) setJobListings(data);
      } catch (err) {
        console.error("Job listings error:", err);
      } finally {
        setJobsLoading(false);
      }
    }
    loadJobListings();
  }, [searchData]);

  // Fetch learning pathways when searchData loads
  useEffect(() => {
    // If no search data or missing ID, skip fetching learning pathways
    if (!searchData?._id) {
      return;
    }

    // Async function to fetch learning pathways from backend API using search ID
    async function loadLearningPathways() {
      setLearningLoading(true);

      try {
        // Auth token
        const token = localStorage.getItem("token");

        // Fetch learning pathways
        const res = await fetch(`${baseUrl}/dashboard/learning-pathways/${searchData._id}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // If no resulting data then error
        if (!res.ok) {
          throw new Error(data.message || "Failed to load learning pathways");
        }

        setLearningData(data);
      }
      // If error then log
      catch (err) {
        console.error("Learning pathways error:", err);
        setLearningData(null);
      }
      // Finish loading
      finally {
        setLearningLoading(false);
      }
    }
    loadLearningPathways();
  }, [searchData]);

  // Fetch user's major courses for col 3
  useEffect(() => {
    if (!searchData?.academic?.majorId) return;
    async function loadMajor() {
      try {
        const res = await fetch(`${baseUrl}/majors/${searchData.academic.majorId}`);
        const data = await res.json();
        setMajorData(data);
      } catch (err) { console.error(err); }
    }
    loadMajor();
  }, [searchData]);

  // Fetch all majors for CISE tab
  useEffect(() => {
    async function loadAllMajors() {
      try {
        const res = await fetch(`${baseUrl}/majors`);
        const data = await res.json();
        setAllMajors(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    }
    loadAllMajors();
  }, []);

  // Auto-select user's major when CISE tab opens
  useEffect(() => {
    if (activeTab !== 2 || !searchData?.academic?.majorId) return;
    async function autoLoad() {
      try {
        const res = await fetch(`${baseUrl}/majors/${searchData.academic.majorId}`);
        const data = await res.json();
        setSelectedMajor(data);
      } catch (err) { console.error(err); }
    }
    autoLoad();
  }, [activeTab, searchData]);

  async function handleSelectMajor(id) {
    if (selectedMajor?._id === id) { setSelectedMajor(null); return; }
    try {
      const res = await fetch(`${baseUrl}/majors/${id}`);
      const data = await res.json();
      setSelectedMajor(data);
    } catch (err) { console.error(err); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: "#2E03A5", fontSize: "18px" }}>
      Loading dashboard...
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: "red" }}>
      {error}
    </div>
  );

  if (!searchData) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: "#888" }}>
      No dashboard data found.
    </div>
  );

  // Use real job data or fall back to mock
  const recommendedCareers = jobListings?.recommendedCareers || [];
  const jobResults = jobListings?.jobs || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF3EA",
        backgroundImage: texture,
        backgroundRepeat: "repeat",
        backgroundPosition: "top left",
        fontFamily: "'Georgia', serif",
        paddingTop: "50px", // increase from current value
        marginTop: 0,
      }}
    >
      {/* Page Title */}
      <div
        style={{
          textAlign: "center",
          marginTop: "6px",
          marginBottom: "24px", // was 10px
          paddingBottom: "6px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#2E03A5",
            letterSpacing: "2px",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: 1.1,
            fontFamily: "'Georgia', serif",
            textShadow: "1px 2px 6px rgba(180,180,200,0.35)",
          }}
        >
          User Dashboard
        </h1>
        <p
          style={{
            marginTop: "6px",
            color: "#8f8f8f",
            fontSize: "20px",
            fontFamily: "'Georgia', serif",
          }}
        >
          Personalized Career Insights
        </p>
      </div>

      {/* Tabs + actions row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 28px 14px 28px", // was 8px top
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
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

          {activeTab !== -1 && (
            <button
              onClick={() => setActiveTab(-1)}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "1px solid #2E03A5",
                backgroundColor: "white",
                color: "#2E03A5",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "'Georgia', serif",
              }}
            >
              Main Dashboard
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <StarButtonToggle search={searchData} onUpdated={(updated) => setSearchData(updated)} />

          <button
            onClick={() => navigate("/past-searches")}
            style={{
              backgroundColor: "#2E03A5",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "'Georgia', serif",
              boxShadow: "0 3px 10px rgba(46,3,165,0.35)",
            }}
          >
            Past Searches
          </button>

          <button
            onClick={() => navigate("/search")}
            style={{
              backgroundColor: "#F97000",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "'Georgia', serif",
              boxShadow: "0 3px 10px rgba(249,112,0,0.35)",
            }}
          >
            Career Search
          </button>
        </div>
      </div>

      {/* DEFAULT 3-COLUMN VIEW */}
      {activeTab === -1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", padding: "0 28px 40px" }}>
          {/* Col 1: Career Paths */}
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>Career Paths Based on the Information You Entered</h3>
            <p style={{ fontSize: "13px", color: "#777", marginBottom: "20px", fontStyle: "italic" }}>By Best Match</p>
            {jobsLoading ? (
              <p style={{ color: "#aaa", fontSize: "13px", textAlign: "center" }}>Loading career matches...</p>
            ) : jobResults.length > 0 ? (
              <>
                {jobResults.slice(0, 4).map((job, i) => (
                  <div key={i} style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: i < 3 ? "1px solid #eee" : "none" }}>
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "#111", marginBottom: "2px" }}>{job.title}</div>
                    <div style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>{job.found} listing{job.found !== 1 ? "s" : ""} found</div>
                    {job.salary !== "N/A" ? (
                      <div style={{ fontSize: "15px", fontWeight: "bold", color: "#2E03A5" }}>
                        {formatSalary(job.salary)} <span style={{ fontSize: "11px", fontWeight: "normal", color: "#888" }}>/ year</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: "12px", color: "#bbb" }}>Salary data unavailable</div>
                    )}
                  </div>
                ))}
                <button onClick={() => setActiveTab(0)} style={{
                  marginTop: "8px", width: "100%", backgroundColor: "transparent",
                  border: "1px solid #2E03A5", color: "#2E03A5", borderRadius: "20px",
                  padding: "8px", fontSize: "13px", cursor: "pointer",
                  fontFamily: "'Georgia', serif", fontWeight: "600",
                }}>
                  View All Career Info
                </button>
              </>
            ) : (
              MOCK_CAREERS.map((c, i) => (
                <div key={i} style={{ marginBottom: "24px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px", borderBottom: "2px solid #333", paddingBottom: "4px", marginBottom: "6px", display: "inline-block" }}>{c.title}</div>
                  <p style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: "1.5" }}>{c.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Col 2: Resources + Extracurriculars */}
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>Proposed Resources for Specified Career:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {learningLoading ? (
                <p style={{ color: "#777", fontSize: "13px" }}>Loading learning resources...</p>
              ) : learningData?.resources?.length ? (
                learningData.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "10px 14px",
                      fontSize: "13px",
                      color: "#2E03A5",
                      fontStyle: "italic",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {r.provider} — {r.title}
                  </a>
                ))
              ) : (
                <div style={{ color: "#777", fontSize: "13px" }}>No resources found yet.</div>
              )}
              {learningLoading ? (
                <p style={{ color: "#777", fontSize: "13px" }}>Loading learning resources...</p>
              ) : learningData?.resources?.length ? (
                learningData.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "10px 14px",
                      fontSize: "13px",
                      color: "#2E03A5",
                      fontStyle: "italic",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {r.provider} — {r.title}
                  </a>
                ))
              ) : (
                <div style={{ color: "#777", fontSize: "13px" }}>No resources found yet.</div>
              )}
            </div>
            <h3 style={colHeaderStyle}>Extracurriculars:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "10px 14px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.6)" }}>
                <strong style={{ display: "block", marginBottom: "6px" }}>Languages to Master</strong>
                {learningData?.languages?.length ? learningData.languages.slice(0, 3).join(", ") : "No language suggestions yet."}
              </div>

              <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "10px 14px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.6)" }}>
                <strong style={{ display: "block", marginBottom: "6px" }}>Platforms to Utilize</strong>
                {learningData?.platforms?.length ? learningData.platforms.slice(0, 3).join(", ") : "No platform suggestions yet."}
              </div>

              <div style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "10px 14px", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.6)" }}>
                <strong style={{ display: "block", marginBottom: "6px" }}>Certifications to Add</strong>
                {learningData?.certifications?.length ? learningData.certifications.slice(0, 3).join(", ") : "No certification suggestions yet."}
              </div>
            </div>
          </div>

          {/* Col 3: CISE Majors from DB */}
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>CISE Majors</h3>
            {searchData && (
              <div style={{ backgroundColor: "rgba(46,3,165,0.06)", borderRadius: "6px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#444", borderLeft: "3px solid #2E03A5" }}>
                <div><strong>Major:</strong> {searchData.academic?.majorLabel || "—"}</div>
                {searchData.academic?.minor && <div><strong>Minor:</strong> {searchData.academic.minor}</div>}
                {searchData.academic?.certificate && <div><strong>Certificate:</strong> {searchData.academic.certificate}</div>}
              </div>
            )}
            {!majorData && <p style={{ color: "#999", fontSize: "13px", textAlign: "center" }}>Submit a search to see your major's courses here.</p>}
            {majorData && (
              <>
                {majorData.core_coursework?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#2E03A5", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", borderBottom: "2px solid #2E03A5", paddingBottom: "4px" }}>Core Coursework</div>
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
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#F97000", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", borderBottom: "2px solid #F97000", paddingBottom: "4px" }}>Required Foundation</div>
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
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", borderBottom: "2px solid #aaa", paddingBottom: "4px" }}>Elective Areas</div>
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

      {/* CAREER INFORMATION TAB */}
      {activeTab === 0 && (
        <div style={{ padding: "0 28px 40px" }}>
          <div style={{ ...colStyle, minHeight: "unset" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "bold", textAlign: "center", color: "#111", marginBottom: "6px" }}>
              Career Paths Based on the Information You Entered
            </h2>
            <p style={{ textAlign: "center", fontWeight: "bold", color: "#333", marginBottom: "32px" }}>By Best Match</p>

            {jobsLoading ? (
              <p style={{ textAlign: "center", color: "#aaa", fontSize: "14px" }}>Loading job listings...</p>
            ) : jobResults.length > 0 ? (
              <>
                {jobResults.map((job, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
                    gap: "24px", alignItems: "center",
                    borderBottom: i < jobResults.length - 1 ? "1px solid #eee" : "none",
                    paddingBottom: "20px", marginBottom: "20px",
                  }}>
                    {/* Title */}
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px", color: "#111", marginBottom: "4px" }}>{job.title}</div>
                      <div style={{ fontSize: "12px", color: "#999" }}>{job.found} listing{job.found !== 1 ? "s" : ""} found</div>
                    </div>
                    {job.matchScore != null && (
                      <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
                        ML Match: {(job.matchScore * 100).toFixed(1)}%
                      </div>
                    )}
                    {/* Salary */}
                    <div>
                      <span style={{ fontSize: "20px", fontWeight: "bold", color: job.salary !== "N/A" ? "#111" : "#aaa" }}>
                        {job.salary}
                      </span>
                      {job.salary !== "N/A" && <span style={{ fontSize: "12px", color: "#888" }}> / year</span>}
                    </div>
                    {/* View jobs button */}
                    <div>
                      <a
                        href={`https://www.adzuna.com/search?q=${encodeURIComponent(job.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          backgroundColor: "#2E03A5", color: "white", textDecoration: "none",
                          borderRadius: "20px", padding: "8px 18px", fontSize: "13px",
                          fontWeight: "600", fontFamily: "'Georgia', serif",
                          display: "inline-block",
                        }}
                      >
                        View Jobs →
                      </a>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Fallback to mock
              MOCK_CAREERS.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr", gap: "32px", alignItems: "center", borderBottom: i < MOCK_CAREERS.length - 1 ? "1px solid #eee" : "none", paddingBottom: "24px", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "17px", color: "#111", marginBottom: "8px" }}>{c.title}</div>
                    <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{c.description}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "30px", fontWeight: "bold", color: "#111" }}>${c.avg.toLocaleString()}</span>
                    <span style={{ fontSize: "12px", color: "#888" }}> / avg. per year</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "2px" }}>
                      <span>Annual Salary Range</span>
                      <span>${(c.rangeMin / 1000).toFixed(0)}K–{(c.rangeMax / 1000).toFixed(0)}K</span>
                    </div>
                    <SalaryBar min={c.rangeMin} max={c.rangeMax} overall={salaryOverall} />
                    <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>Range Based on Your Area</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LEARNING PATHWAYS TAB */}
      {activeTab === 1 && <LearningPathways learningData={learningData} loading={learningLoading} />}

      {/* CISE MAJORS TAB */}
      {activeTab === 2 && (
        <div style={{ padding: "0 28px 40px" }}>
          {searchData && (
            <div style={{ backgroundColor: "rgba(46,3,165,0.06)", borderRadius: "6px", padding: "14px 18px", marginBottom: "20px", fontSize: "13px", color: "#444", borderLeft: "4px solid #2E03A5", display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <div><strong>Major:</strong> {searchData.academic?.majorLabel || "—"}</div>
              {searchData.academic?.minor && <div><strong>Minor:</strong> {searchData.academic.minor}</div>}
              {searchData.academic?.certificate && <div><strong>Certificate:</strong> {searchData.academic.certificate}</div>}
              {searchData.academic?.coursesTaken?.length > 0 && <div><strong>Courses Taken:</strong> {searchData.academic.coursesTaken.map(c => c.code).join(", ")}</div>}
              {searchData.additional?.expectedGraduationDate && <div><strong>Graduating:</strong> {searchData.additional.expectedGraduationDate}</div>}
            </div>
          )}
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

export default Dashboard;
