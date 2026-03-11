import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

// Page shows the user's past searches that they have starred/saved. They can click on one to load it in the dashboard and see results for it
export default function PastSearchesPage() {
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load saved searches on component mount
  async function loadSaved() {
    setError("");
    // Check for token, if not present redirect to /searches form to make a new search first
    const token = localStorage.getItem("token");
    if (!token) {
        return navigate("/searches");
    }

    // Fetch saved searches from backend
    const res = await fetch("http://localhost:5000/searches/saved", {
      headers: {Authorization: `Bearer ${token}`},
    });

    // Parse response
    const data = await res.json();
    // If Saved searches endpoint returns an error
    if (!res.ok) {
      setError(data?.message || "Failed to load saved searches");
      return;
    }
    setSaved(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadSaved();
  }, []);

  // When user clicks on a saved search, navigate to dashboard and pass the search data in state
  async function onSelect(search) {
    navigate("/dashboard", {state: {activeSearch: search}});
  }

  return (
  <div style={{padding: 24}}>
    <h1>Past (Saved) Searches</h1>

    <div style={{marginBottom: 16, display: "flex", gap: 12}}>
      <button onClick={() => navigate("/search")}>
        Create New Search
      </button>

      <button onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>

    {error && <div style={{color: "red", marginBottom: 12}}>{error}</div>}

    {saved.length === 0 ? (
      <div>No saved searches yet.</div>
    ) : (
      <ul>
        {saved.map((s) => (
          <li key={s._id} style={{marginBottom: 12}}>
            <div><b>{s.searchName || "(Unnamed Search)"}</b></div>
            <div>{s.academic?.majorLabel}</div>
            <button onClick={() => onSelect(s)}>Select</button>
          </li>
        ))}
      </ul>
    )}
  </div>
)};
