import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarButtonToggle from "../components/StarButtonToggle";
import { baseUrl } from "../constants";
import { Tab } from "../App.js";
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

const MOCK_CAREERS = [
  { title: "Cyber Security: Analyst", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 70000, rangeMin: 40000, rangeMax: 100000 },
  { title: "Cloud Security Engineer", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 90000, rangeMin: 60000, rangeMax: 120000 },
  { title: "Software Engineer", description: "Your coursework, optional minor, and certifications would make you an ideal candidate for this role.", avg: 95000, rangeMin: 40000, rangeMax: 150000 },
];

const TABS = ["Career Information", "Learning Pathways", "CISE Majors"];

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
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const pct = (v) => Math.round(((v - overall.min) / (overall.max - overall.min)) * 100);
  return (
    <div style={{ position: "relative", height: "6px", backgroundColor: t.border, borderRadius: "3px", margin: "8px 0" }}>
      <div style={{ position: "absolute", left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%`, height: "100%", backgroundColor: t.accent, borderRadius: "3px" }} />
      <div style={{ position: "absolute", left: `${pct(min)}%`, top: "-4px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: t.accent, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: `${pct(max)}%`, top: "-4px", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: t.accent, transform: "translateX(-50%)" }} />
    </div>
  );
}

// Learning Pathways function that implements seeded data recommendation system
function LearningPathways({ learningData, loading }) {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const [showNote, setShowNote] = useState(true);
  const languages = learningData?.languages || [];
  const platforms = learningData?.platforms || [];
  const certifications = learningData?.certifications || [];
  const resources = learningData?.resources || [];
  const youtubeResources = learningData?.youtubeResources || [];

  const normalizeText = (value = "") =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");

  const capitalizeFirstLetter = (value = "") => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatResourceLabel = (resource = {}) => {
    const provider = (resource.provider || "").trim();
    const title = (resource.title || "").trim();

    if (!provider) return title;
    if (!title) return provider;

    const normalizedProvider = normalizeText(provider);
    const normalizedTitle = normalizeText(title);
    const capitalizedTitle = capitalizeFirstLetter(title);


    if (normalizedProvider === normalizedTitle || normalizedTitle.includes(normalizedProvider) || normalizedProvider.includes(normalizedTitle)) {
      return capitalizedTitle;
    }

    return `${capitalizedTitle}`;
  };

  const sectionBlue = t.accent;
  const sectionOrange = "#D97A1E";

  const sectionHeaderStyle = {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    width: "100%",
    gap: "0px",
    marginBottom: "14px"
  };

  const sectionHeaderTextStyle = (accentColor) => ({
    fontSize: "14px",
    fontWeight: "700",
    color: accentColor,
    textAlign: "center",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    lineHeight: 1.2,
    marginBottom: "5px"
  });

  const sectionHeaderLineStyle = (accentColor) => ({
    width: "100%",
    borderTop: `2px solid ${accentColor}`,
    opacity: 0.95,
    marginTop: "2px",
    marginBottom: "5px"
  });

  const linkCardStyle = {
    border: `1px solid ${t.border}`,
    borderRadius: "4px",
    padding: "12px 18px",
    fontSize: "14px",
    textAlign: "center",
    color: t.accent,
    fontStyle: "italic",
    backgroundColor: t.card,
    cursor: "pointer",
    textDecoration: "none",
    display: "block"
  };

  const bulletItemStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: t.text,
    lineHeight: "1.4"
  };

  const bulletStyle = {
    fontSize: "22px",
    lineHeight: 1,
    color: t.textMuted,
    flexShrink: 0,
    marginTop: "-1px"
  };

  return (
    <div style={{ padding: "0 28px 40px", position: "relative" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ width: "100%" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: t.text,
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            Proposed Resources for Specified Career
          </h2>

          {showNote && (
            <div
              style={{
                width: "100%",
                backgroundColor: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: "8px",
                padding: "16px 20px",
                boxShadow: t.shadow,
                position: "relative",
                fontSize: "13px",
                marginBottom: "28px"
              }}
            >
              <button
                onClick={() => setShowNote(false)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: t.textLight
                }}
              >
                ✕
              </button>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", color: t.text }}>ℹ</span>
                <strong style={{ fontSize: "13px", lineHeight: "1.4", color: t.text }}>
                  Note: These resources are proposed to be directly correlated to potential careers
                </strong>
              </div>

              <p style={{ color: t.textMuted, lineHeight: "1.5", marginBottom: "12px" }}>
                You may also manually add your extracurricular activities. These experiences can help you land different job opportunities!
              </p>

              <button
                onClick={() => setShowNote(false)}
                style={{
                  backgroundColor: t.accent,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "'Georgia', serif"
                }}
              >
                Great!
              </button>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "24px",
              marginBottom: "40px",
              alignItems: "start"
            }}
          >
            <div>
              <div style={sectionHeaderStyle}>
                <span style={sectionHeaderTextStyle(sectionBlue)}>Recommended Resources</span>
                <div style={sectionHeaderLineStyle(sectionBlue)} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loading ? (
                  <p style={{ color: t.textMuted }}>Loading recommended resources...</p>
                ) : resources.length ? (
                  resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={linkCardStyle}
                    >
                      {formatResourceLabel(r)}
                    </a>
                  ))
                ) : (
                  <div style={{ color: t.textMuted, fontSize: "14px" }}>
                    No recommended resources found yet.
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={sectionHeaderStyle}>
                <span style={sectionHeaderTextStyle(sectionOrange)}>YouTube Searches</span>
                <div style={sectionHeaderLineStyle(sectionOrange)} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loading ? (
                  <p style={{ color: t.textMuted }}>Loading YouTube searches...</p>
                ) : youtubeResources.length ? (
                  youtubeResources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      style={linkCardStyle}
                    >
                      {formatResourceLabel(r)}
                    </a>
                  ))
                ) : (
                  <div style={{ color: t.textMuted, fontSize: "14px" }}>
                    No YouTube searches found yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: t.text,
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            Extracurriculars
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "24px",
              alignItems: "start"
            }}
          >
            {[
              {label: "Languages or Skills to Master", items: languages, accent: sectionBlue},
              {label: "Platforms to Utilize", items: platforms, accent: sectionOrange},
              {label: "Certifications to Add", items: certifications, accent: sectionBlue},
            ].map(({label, items, accent}, idx) => (
              <div key={idx}>
                <div style={sectionHeaderStyle}>
                  <span style={sectionHeaderTextStyle(accent)}>{label}</span>
                  <div style={sectionHeaderLineStyle(accent)} />
                </div>

                {items.length ? (
                  items.map((item, i) => (
                    <div key={i} style={bulletItemStyle}>
                      <span style={bulletStyle}>•</span>
                      <span>{capitalizeFirstLetter(item)}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: t.textMuted, fontSize: "13px" }}>No suggestions yet.</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
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
  const [showStarTooltip, setShowStarTooltip] = useState(false);
  const [seniorityFilter, setSeniorityFilter] = useState("All");
  const [seniorityTouched, setSeniorityTouched] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All");
  const [locationTouched, setLocationTouched] = useState(false);
  const SENIORITY_OPTIONS = ["All", "Internship", "Junior", "Mid Level", "Senior", "Lead", "Manager"];

  const location = useLocation();
  const navigate = useNavigate();

  const capitalizeFirstLetter = (value = "") => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = sessionStorage.getItem("token");
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
  }, [location.state, navigate, setActiveTab]);

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
          state: "United States",  // changed from "Florida"
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
  }, [
    searchData?.academic?.majorLabel,
    searchData?.academic?.minor,
    searchData?.academic?.certificate,
    searchData?.current,
  ]);

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
        const token = sessionStorage.getItem("token");

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
  }, [searchData?._id]);

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
  }, [searchData?.academic?.majorId]);

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
  }, [activeTab, searchData?.academic?.majorId]);

  async function handleSelectMajor(id) {
    if (selectedMajor?._id === id) { setSelectedMajor(null); return; }
    try {
      const res = await fetch(`${baseUrl}/majors/${id}`);
      const data = await res.json();
      setSelectedMajor(data);
    } catch (err) { console.error(err); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: t.bg, backgroundImage: texture, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: t.accent, fontSize: "18px" }}>
      Loading dashboard...
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", backgroundColor: t.bg, backgroundImage: texture, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: "red" }}>
      {error}
    </div>
  );

  if (!searchData) return (
    <div style={{ minHeight: "100vh", backgroundColor: t.bg, backgroundImage: texture, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: t.textMuted }}>
      No dashboard data found.
    </div>
  );

  // Use real job data or fall back to mock
  const recommendedCareers = jobListings?.recommendedCareers || [];
  const jobResults = jobListings?.jobs || [];

  // Build location dropdown options from actual job data
  const locationOptions = ["All", ...new Set(jobResults.map(job => job.location).filter(l => l && l !== "Unknown"))];

  const filteredJobResults = jobResults.filter(job => {
    if (seniorityFilter !== "All" && job.seniority !== seniorityFilter) return false;
    if (locationFilter !== "All" && job.location !== locationFilter) return false;
    return true;
  });

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: t.bg,
      backgroundImage: texture,
      backgroundRepeat: "repeat",
      backgroundPosition: "top left",
      fontFamily: "'Georgia', serif",
      paddingTop: "50px",
      marginTop: 0,
    }}>
      <div style={{ textAlign: "center", marginTop: "6px", marginBottom: "24px", paddingBottom: "6px" }}>
        <h1 style={{
          fontSize: "48px", fontWeight: "700", color: t.accent,
          letterSpacing: "2px", textTransform: "uppercase", margin: 0,
          lineHeight: 1.1, fontFamily: "'Georgia', serif",
          textShadow: "1px 2px 6px rgba(180,180,200,0.35)",
        }}>
          User Dashboard
        </h1>
        <p style={{ marginTop: "6px", color: t.textMuted, fontSize: "20px", fontFamily: "'Georgia', serif" }}>
          Personalized Career Insights
        </p>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 28px 14px 28px",
        flexWrap: "wrap",
        gap: "10px",
      }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              padding: "8px 20px", borderRadius: "20px", border: `1px solid ${t.border}`,
              backgroundColor: activeTab === i ? t.accent : t.card,
              color: activeTab === i ? "white" : t.text,
              fontWeight: activeTab === i ? "600" : "400",
              cursor: "pointer", fontSize: "14px", fontFamily: "'Georgia', serif",
            }}>
              {tab}
            </button>
          ))}
          {activeTab !== -1 && (
            <button onClick={() => setActiveTab(-1)} style={{
              padding: "8px 20px", borderRadius: "20px", border: `1px solid ${t.accent}`,
              backgroundColor: "transparent", color: t.accent,
              fontWeight: "600", cursor: "pointer", fontSize: "14px", fontFamily: "'Georgia', serif",
            }}>
              Main Dashboard
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowStarTooltip(true)}
            onMouseLeave={() => setShowStarTooltip(false)}
          >
            <StarButtonToggle 
              search={searchData}
              onUpdated={(updated) =>
                setSearchData((prev) =>
                  prev
                    ? {
                        ...prev,
                        starred: updated.starred,
                        expiresAt: updated.expiresAt,
                        updatedAt: updated.updatedAt,
                      }
                    : updated
                )
              }
              variant="icon"
            />
            {showStarTooltip && (
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#333",
                color: "white",
                fontSize: "12px",
                padding: "6px 10px",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                zIndex: 100,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}>
                {searchData?.starred ? "Unstar to remove from Past Searches" : "Star to save & access in Past Searches"}
                <div style={{
                  position: "absolute",
                  top: "100%", left: "50%",
                  transform: "translateX(-50%)",
                  borderWidth: "5px", borderStyle: "solid",
                  borderColor: "#333 transparent transparent transparent",
                }} />
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/past-searches")}
            style={{
              backgroundColor: t.accent, color: "white", border: "none",
              borderRadius: "20px", padding: "8px 20px", fontSize: "16px",
              fontWeight: "bold", cursor: "pointer", fontFamily: "'Georgia', serif",
              boxShadow: "0 3px 10px rgba(46,3,165,0.35)",
            }}
          >
            Past Searches
          </button>
          <button
            onClick={() => navigate("/search")}
            style={{
              backgroundColor: t.orange, color: "white", border: "none",
              borderRadius: "20px", padding: "8px 20px", fontSize: "16px",
              fontWeight: "bold", cursor: "pointer", fontFamily: "'Georgia', serif",
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
          <div style={{
            backgroundColor: isDark ? "rgba(30,30,50,0.97)" : "rgba(255,255,255,0.97)",
            borderRadius: "6px",
            padding: "24px",
            boxShadow: t.shadow,
            minHeight: "500px",
          }}>
            <h3 style={{
              fontSize: "16px", fontWeight: "bold", textAlign: "center", color: t.text,
              marginBottom: "-10px", lineHeight: "1.4",
            }}>
              Career Paths Based on the Information You Entered
            </h3>
            <p style={{ fontSize: "13px", color: t.textMuted, marginBottom: "20px", textAlign: "center", fontStyle: "italic" }}>By Best Match</p>
            {jobsLoading ? (
              <p style={{ color: t.textLight, fontSize: "13px", textAlign: "center" }}>Loading career matches...</p>
            ) : jobResults.length > 0 ? (
              <>
                {jobResults.slice(0, 4).map((job, i) => (
                  <div key={i} style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: i < 3 ? `1px solid ${t.border}` : "none" }}>
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: t.text, textAlign: "center", marginBottom: "2px" }}>{job.title}</div>
                    <div style={{ fontSize: "12px", color: t.textLight, textAlign: "center", marginBottom: "6px" }}>{job.found} listing{job.found !== 1 ? "s" : ""} found</div>
                    {job.salary !== "N/A" ? (
                      <div style={{ fontSize: "15px", textAlign: "center", fontWeight: "bold", color: t.accent }}>
                        {formatSalary(job.salary)} <span style={{ fontSize: "11px", fontWeight: "normal", color: t.textMuted }}>/ year</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: "12px", color: t.textLight }}>Salary data unavailable</div>
                    )}
                  </div>
                ))}
                <button onClick={() => setActiveTab(0)} style={{
                  marginTop: "8px", width: "100%", backgroundColor: "transparent",
                  border: `1px solid ${t.accent}`, color: t.accent, borderRadius: "20px",
                  padding: "8px", fontSize: "13px", cursor: "pointer",
                  fontFamily: "'Georgia', serif", fontWeight: "600",
                }}>
                  View All Career Info
                </button>
              </>
            ) : (
              MOCK_CAREERS.map((c, i) => (
                <div key={i} style={{ marginBottom: "24px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px", borderBottom: `2px solid ${t.text}`, paddingBottom: "4px", marginBottom: "6px", display: "inline-block", color: t.text }}>{c.title}</div>
                  <p style={{ fontSize: "13px", color: t.textMuted, margin: 0, lineHeight: "1.5" }}>{c.description}</p>
                </div>
              ))
            )}
          </div>

          {/* Col 2: Resources + Extracurriculars */}
          <div style={{
            backgroundColor: isDark ? "rgba(30,30,50,0.97)" : "rgba(255,255,255,0.97)",
            borderRadius: "6px",
            padding: "24px",
            boxShadow: t.shadow,
            minHeight: "500px",
          }}>
            <h3 style={{
              fontSize: "16px", fontWeight: "bold", textAlign: "center", color: t.text,
              marginBottom: "16px", lineHeight: "1.4",
            }}>
              Proposed Resources for Specified Career
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {learningLoading ? (
                <p style={{ color: t.textMuted, fontSize: "13px" }}>Loading learning resources...</p>
              ) : learningData?.resources?.length ? (
                learningData.resources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{
                    border: `1px solid ${t.border}`, borderRadius: "4px", padding: "10px 14px",
                    fontSize: "13px", color: t.accent, fontStyle: "italic", textAlign: "center",
                    backgroundColor: t.cardSolid, textDecoration: "none", display: "block",
                  }}>
                    {r.title}
                  </a>
                ))
              ) : (
                <div style={{ color: t.textMuted, fontSize: "13px" }}>No resources found yet.</div>
              )}
            </div>
            <h3 style={{
              fontSize: "16px", fontWeight: "bold", textAlign: "center", color: t.text,
              marginBottom: "16px", lineHeight: "1.4",
            }}>
              Extracurriculars
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Languages or Skills to Master", data: learningData?.languages },
                { label: "Platforms to Utilize", data: learningData?.platforms },
                { label: "Certifications to Add", data: learningData?.certifications },
              ].map(({ label, data }, i) => (
                <div key={i} style={{ border: `1px solid ${t.border}`, borderRadius: "4px", padding: "10px 14px", fontSize: "13px",  textAlign: "center", backgroundColor: t.cardSolid, color: t.text }}>
                  <strong style={{ display: "block", marginBottom: "6px" }}>{label}</strong>
                  {data?.length
                    ? data
                        .slice(0, 3)
                        .map((item) =>
                          label === "Certifications to Add" ? capitalizeFirstLetter(item) : item
                        )
                        .join(", ")
                    : "No suggestions yet."}
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: CISE Majors from DB */}
          <div style={{
            backgroundColor: isDark ? "rgba(30,30,50,0.97)" : "rgba(255,255,255,0.97)",
            borderRadius: "6px",
            padding: "24px",
            boxShadow: t.shadow,
            minHeight: "500px",
          }}>
            <h3 style={{
              fontSize: "16px", fontWeight: "bold", textAlign: "center", color: t.text,
              marginBottom: "16px", lineHeight: "1.4",
            }}>
              CISE Majors
            </h3>
            {searchData && (
              <div style={{
                backgroundColor: t.accentLight, borderRadius: "8px", padding: "12px 14px", marginBottom: "16px", fontSize: "13px", textAlign: "center", color: t.text, borderLeft: `3px solid ${t.accent}` }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  color: t.accent,
                  marginBottom: "6px",
                }}>
                  Based on Your Search
                </div>
                <div style={{ marginBottom: "3px" }}><strong>Major:</strong> {searchData.academic?.majorLabel || "—"}</div>
                {searchData.academic?.minor && <div style={{ marginBottom: "3px" }}><strong>Minor:</strong> {searchData.academic.minor}</div>}
                {searchData.academic?.certificate && <div style={{ marginBottom: "3px" }}><strong>Certificate:</strong> {searchData.academic.certificate}</div>}
                {searchData.academic?.coursesTaken?.length > 0 && <div style={{ marginBottom: "3px" }}><strong>Courses Taken:</strong> {searchData.academic.coursesTaken.map(c => c.code).join(", ")}</div>}
                {searchData.additional?.expectedGraduationDate && <div style={{ marginBottom: "3px" }}><strong>Graduating:</strong> {searchData.additional.expectedGraduationDate}</div>}
                <div style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: `1px solid ${t.border}`,
                  fontSize: "11px",
                  color: t.textLight,
                  fontStyle: "italic",
                }}>
                  <span onClick={() => navigate("/search")} style={{ color: t.accent, cursor: "pointer", textDecoration: "underline" }}>Update your search →</span>
                </div>
              </div>
            )}
            {!majorData && <p style={{ color: t.textLight, fontSize: "13px", textAlign: "center" }}>Submit a search to see your major's courses here.</p>}
            {majorData && (
              <>
                {majorData.core_coursework?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: t.accent, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", borderBottom: `2px solid ${t.accent}`, paddingBottom: "4px" }}>Core Coursework</div>
                    {majorData.core_coursework.slice(0, 4).map((c, i) => (
                      <div key={i} style={{ marginBottom: "8px", paddingLeft: "8px", borderLeft: `2px solid ${t.accent}` }}>
                        <span style={{ fontWeight: "bold", fontSize: "13px", color: t.accent }}>{c.code}</span>
                        <span style={{ fontSize: "13px", color: t.text }}> — {c.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {majorData.required_foundation?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: t.orange, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", borderBottom: `2px solid ${t.orange}`, paddingBottom: "4px" }}>Required Foundation</div>
                    {majorData.required_foundation.slice(0, 4).map((c, i) => (
                      <div key={i} style={{ marginBottom: "8px", paddingLeft: "8px", borderLeft: `2px solid ${t.orange}` }}>
                        <span style={{ fontWeight: "bold", fontSize: "13px", color: t.orange }}>{c.code}</span>
                        <span style={{ fontSize: "13px", color: t.text }}> — {c.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {majorData.elective_areas?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: t.textMuted, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", borderBottom: `2px solid ${t.border}`, paddingBottom: "4px" }}>Elective Areas</div>
                    {majorData.elective_areas.slice(0, 4).map((area, i) => (
                      <div key={i} style={{ marginBottom: "6px", paddingLeft: "8px", borderLeft: `2px solid ${t.border}`, fontSize: "13px", color: t.text }}>{area}</div>
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
          <div style={{
            backgroundColor: t.card,
            borderRadius: "6px",
            padding: "24px",
            boxShadow: t.shadow,
            minHeight: "unset",
          }}>
            <h2 style={{ fontSize: "26px", fontWeight: "bold", textAlign: "center", color: t.text, marginBottom: "6px" }}>
              Career Paths Based on the Information You Entered
            </h2>
            <p style={{ textAlign: "center", fontWeight: "bold", color: t.textMuted, marginBottom: "16px" }}>By Best Match</p>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
              <select
                value={seniorityFilter}
                onChange={(e) => {setSeniorityFilter(e.target.value); setSeniorityTouched(true)}}
                style={{
                  padding: "8px 14px", borderRadius: "20px", border: `1px solid ${t.border}`,
                  fontSize: "13px", fontFamily: "'Georgia', serif", cursor: "pointer",
                  backgroundColor: t.inputBg, color: t.text,
                }}
              >
                <option value="All">
                  {seniorityTouched ? "All Seniority Levels" : "Select Seniority Level"}
                </option>
                {SENIORITY_OPTIONS.filter((option) => option !== "All").map(option => <option key={option} value={option}>{option}</option>)}
              </select>

              {/* ← CHANGE input to select dropdown */}
              <select
                value={locationFilter}
                onChange={(e) => {setLocationFilter(e.target.value); setLocationTouched(true);}}
                style={{
                  padding: "8px 14px", borderRadius: "20px", border: `1px solid ${t.border}`,
                  fontSize: "13px", fontFamily: "'Georgia', serif", cursor: "pointer",
                  backgroundColor: t.inputBg, color: t.text,
                }}
              >
                <option value="All">
                  {locationTouched ? "All States" : "Select State"}
                </option>
                {locationOptions.filter((option) => option !== "All").map(option => <option key={option} value={option}>{option}</option>)}
              </select>

              {(seniorityFilter !== "All" || locationFilter !== "All") && (
                <button
                  onClick={() => {setSeniorityFilter("All"); setSeniorityTouched(false); setLocationFilter("All"); setLocationTouched(false);}}
                  style={{
                    padding: "8px 14px", borderRadius: "20px", border: `1px solid ${t.orange}`,
                    fontSize: "13px", fontFamily: "'Georgia', serif", cursor: "pointer",
                    backgroundColor: "transparent", color: t.orange,
                  }}
                >
                  Clear Filters ✕
                </button>
              )}

              <span style={{ fontSize: "12px", color: t.textLight, fontStyle: "italic" }}>
                {filteredJobResults.length} result{filteredJobResults.length !== 1 ? "s" : ""}
              </span>
            </div>
            {jobsLoading ? (
              <p style={{ textAlign: "center", color: t.textLight, fontSize: "14px" }}>Loading job listings...</p>
            ) : jobResults.length === 0 ? (
              MOCK_CAREERS.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr", gap: "32px", alignItems: "center", borderBottom: i < MOCK_CAREERS.length - 1 ? `1px solid ${t.border}` : "none", paddingBottom: "24px", marginBottom: "24px" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "17px", color: t.text, marginBottom: "8px" }}>{c.title}</div>
                    <div style={{ fontSize: "13px", color: t.textMuted, lineHeight: "1.6" }}>{c.description}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: "30px", fontWeight: "bold", color: t.text }}>${c.avg.toLocaleString()}</span>
                    <span style={{ fontSize: "12px", color: t.textMuted }}> / avg. per year</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: t.textMuted, marginBottom: "2px" }}>
                      <span>Annual Salary Range</span>
                      <span>${(c.rangeMin / 1000).toFixed(0)}K–{(c.rangeMax / 1000).toFixed(0)}K</span>
                    </div>
                    <SalaryBar min={c.rangeMin} max={c.rangeMax} overall={salaryOverall} />
                    <div style={{ fontSize: "11px", color: t.textLight, marginTop: "4px" }}>Range Based on Your Area</div>
                  </div>
                </div>
              ))
            ) : filteredJobResults.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: t.textMuted }}>
                <p style={{ fontSize: "18px", marginBottom: "12px" }}>No jobs found for the selected filters.</p>
                <p style={{ fontSize: "14px", marginBottom: "20px" }}>Try adjusting your seniority or location filter.</p>
                <button
                  onClick={() => { setSeniorityFilter("All"); setLocationFilter("All"); }}
                  style={{
                    padding: "10px 24px", borderRadius: "20px", border: "none",
                    backgroundColor: t.accent, color: "white", fontSize: "14px",
                    fontFamily: "'Georgia', serif", cursor: "pointer", fontWeight: "600",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredJobResults.map((job, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
                  gap: "24px", alignItems: "center",
                  borderBottom: i < filteredJobResults.length - 1 ? `1px solid ${t.border}` : "none",
                  paddingBottom: "20px", marginBottom: "20px",
                }}>
                  {/* Title */}
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: t.text, marginBottom: "4px" }}>{job.title}</div>
                    <div style={{ fontSize: "12px", color: t.textLight }}>{job.found} listing{job.found !== 1 ? "s" : ""} found</div>
                  </div>
                  {/* Salary */}
                  <div>
                    <span style={{ fontSize: "20px", fontWeight: "bold", color: job.salary !== "N/A" ? t.text : t.textLight }}>
                      {job.salary}
                    </span>
                    {job.salary !== "N/A" && <span style={{ fontSize: "12px", color: t.textMuted }}> / year</span>}
                  </div>
                  {/* View jobs button */}
                  <div>
                    <a
                      href={`https://www.adzuna.com/search?q=${encodeURIComponent(job.title)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: t.accent, color: "white", textDecoration: "none",
                        borderRadius: "20px", padding: "8px 18px", fontSize: "13px",
                        fontWeight: "600", fontFamily: "'Georgia', serif", display: "inline-block",
                      }}
                    >
                      View Jobs →
                    </a>
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
            <div style={{
              backgroundColor: t.accentLight, borderRadius: "8px", padding: "12px 14px", marginBottom: "16px", fontSize: "13px", color: t.text, borderLeft: `3px solid ${t.accent}` }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: t.accent,
                textAlign: "center",
                marginBottom: "6px",
              }}>
                Based on Your Search
              </div>
              <div style={{ textAlign: "center", marginBottom: "3px" }}><strong>Major:</strong> {searchData.academic?.majorLabel || "—"}</div>
              {searchData.academic?.minor && <div style={{ textAlign: "center", marginBottom: "3px" }}><strong>Minor:</strong> {searchData.academic.minor}</div>}
              {searchData.academic?.certificate && <div style={{ textAlign: "center", marginBottom: "3px" }}><strong>Certificate:</strong> {searchData.academic.certificate}</div>}
              {searchData.academic?.coursesTaken?.length > 0 && <div style={{ textAlign: "center", marginBottom: "3px" }}><strong>Courses Taken:</strong> {searchData.academic.coursesTaken.map(c => c.code).join(", ")}</div>}
              {searchData.additional?.expectedGraduationDate && <div style={{ textAlign: "center", marginBottom: "3px" }}><strong>Graduating:</strong> {searchData.additional.expectedGraduationDate}</div>}
              <div style={{
                marginTop: "8px",
                paddingTop: "8px",
                borderTop: `1px solid ${t.border}`,
                fontSize: "11px",
                textAlign: "center",
                color: t.textLight,
                fontStyle: "italic",
              }}>
                All career paths, resources, and course recommendations below are tailored to this profile.{" "}
                <span onClick={() => navigate("/search")} style={{ color: t.accent, cursor: "pointer", textDecoration: "underline" }}>Update your search →</span>
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {allMajors.map((m) => (
              <div key={m._id} onClick={() => handleSelectMajor(m._id)} style={{
                backgroundColor: selectedMajor?._id === m._id ? t.accentLight : t.card,
                border: selectedMajor?._id === m._id ? `2px solid ${t.accent}` : "2px solid transparent",
                borderRadius: "6px", padding: "20px", cursor: "pointer", boxShadow: t.shadow, transition: "all 0.2s",
              }}>
                <div style={{ fontWeight: "bold", fontSize: "15px", color: t.accent, marginBottom: "4px" }}>{m.major}</div>
                <div style={{ fontSize: "12px", color: t.textMuted }}>{m.university}</div>
              </div>
            ))}
          </div>
          {selectedMajor && (
            <div style={{ backgroundColor: t.card, borderRadius: "6px", padding: "24px", boxShadow: t.shadow }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: t.text, lineHeight: "1.4" }}>{selectedMajor.major}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
                {selectedMajor.core_coursework?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", textAlign: "center", fontWeight: "bold", color: t.accent, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", borderBottom: `2px solid ${t.accent}`, paddingBottom: "4px" }}>Core Coursework</div>
                    {selectedMajor.core_coursework.map((c, i) => (
                      <div key={i} style={{ fontSize: "13px", color: t.text, paddingLeft: "8px", borderLeft: `2px solid ${t.accent}`, marginBottom: "8px" }}>
                        <strong style={{ color: t.accent }}>{c.code}</strong> — {c.title}
                      </div>
                    ))}
                  </div>
                )}
                {selectedMajor.required_foundation?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", textAlign: "center", fontWeight: "bold", color: t.orange, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", borderBottom: `2px solid ${t.orange}`, paddingBottom: "4px" }}>Required Foundation</div>
                    {selectedMajor.required_foundation.map((c, i) => (
                      <div key={i} style={{ fontSize: "13px", color: t.text, paddingLeft: "8px", borderLeft: `2px solid ${t.orange}`, marginBottom: "8px" }}>
                        <strong style={{ color: t.orange }}>{c.code}</strong> — {c.title}
                      </div>
                    ))}
                  </div>
                )}
                {selectedMajor.elective_areas?.length > 0 && (
                  <div>
                    <div style={{ fontSize: "12px", textAlign: "center", fontWeight: "bold", color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px", borderBottom: `2px solid ${t.border}`, paddingBottom: "4px" }}>Elective Areas</div>
                    {selectedMajor.elective_areas.map((area, i) => (
                      <div key={i} style={{ marginBottom: "6px", paddingLeft: "8px", borderLeft: `2px solid ${t.border}`, fontSize: "13px", color: t.text }}>{area}</div>
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
