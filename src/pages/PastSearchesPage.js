import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import StarButtonToggle from "../components/StarButtonToggle";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default function PastSearchesPage() {
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [renameError, setRenameError] = useState("");
  const navigate = useNavigate();

  // Format the expiration date
  function formatExpiry(expiresAt) {
    if (!expiresAt) return "";
    const date = new Date(expiresAt);

    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Allow changing of starred/unstarred in Past Searches
  function handleSearchUpdated(updatedSearch) {
    setSaved((prev) =>
      prev.map((item) => (item._id === updatedSearch._id ? updatedSearch : item))
    );
  }

  async function loadSaved() {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/searches");

    const res = await fetch(`${baseUrl}/searches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) { setError(data?.message || "Failed to load saved searches"); return; }
    setSaved(Array.isArray(data) ? data : []);
  }

  useEffect(() => { loadSaved(); }, []);

  async function onSelect(search) {
    navigate("/dashboard", { state: { activeSearch: search } });
  }

  function startEdit(s) {
    setEditingId(s._id);
    setEditingName(s.searchName || "");
    setRenameError("");
  }

  async function saveRename(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/searches/${id}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ searchName: editingName.trim() || "Unnamed Search" }),
    });
    if (!res.ok) { setRenameError("Failed to rename. Try again."); return; }
    setSaved(saved.map(s => s._id === id ? { ...s, searchName: editingName.trim() || "Unnamed Search" } : s));
    setEditingId(null);
    setRenameError("");
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#FAF3EA", backgroundImage: texture,
      fontFamily: "'Georgia', serif", paddingTop: "80px",
    }}>
      {/* Header */}
      <div style={{ padding: "32px 40px 0" }}>
        <h1 style={{
          fontSize: "36px", fontWeight: "bold", color: "#2E03A5",
          letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px 0",
          textShadow: "1px 2px 6px rgba(180,180,200,0.4)",
        }}>
          Saved Searches
        </h1>
        <p style={{ color: "#888", fontSize: "14px", margin: "0 0 28px 0", letterSpacing: "1px" }}>
          Your starred career path searches
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <button onClick={() => navigate("/search")} style={{
            backgroundColor: "#F97000", color: "white", border: "none",
            borderRadius: "24px", padding: "10px 24px", fontSize: "14px",
            fontWeight: "bold", cursor: "pointer", fontFamily: "'Georgia', serif",
            boxShadow: "0 3px 10px rgba(249,112,0,0.3)",
          }}>
            + New Search
          </button>
          <button onClick={() => navigate("/dashboard")} style={{
            backgroundColor: "transparent", color: "#2E03A5",
            border: "2px solid #2E03A5", borderRadius: "24px",
            padding: "10px 24px", fontSize: "14px", fontWeight: "bold",
            cursor: "pointer", fontFamily: "'Georgia', serif",
          }}>
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 40px 40px" }}>
        {error && (
          <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>{error}</div>
        )}

        {saved.length === 0 ? (
          <div style={{
            backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "10px",
            padding: "60px", textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px", color: "#555", fontWeight: "bold" }}>No saved searches yet</div>
            <div style={{ fontSize: "14px", color: "#999", marginTop: "8px" }}>
              Star a search from the dashboard to save it here
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {saved.map((s) => (
              <div key={s._id} style={{
                backgroundColor: "rgba(255,255,255,0.7)", borderRadius: "8px",
                padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "16px", flexWrap: "wrap",
                borderLeft: "4px solid #2E03A5",
              }}>
                {/* Left: name + major */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  {editingId === s._id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveRename(s._id); if (e.key === "Escape") setEditingId(null); }}
                        autoFocus
                        style={{
                          fontSize: "16px", fontWeight: "bold", color: "#111",
                          border: "2px solid #2E03A5", borderRadius: "4px",
                          padding: "4px 10px", fontFamily: "'Georgia', serif",
                          outline: "none", backgroundColor: "#fff",
                        }}
                      />
                      <button onClick={() => saveRename(s._id)} style={{
                        backgroundColor: "#2E03A5", color: "white", border: "none",
                        borderRadius: "4px", padding: "5px 14px", cursor: "pointer",
                        fontSize: "13px", fontFamily: "'Georgia', serif",
                      }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{
                        backgroundColor: "transparent", color: "#999", border: "1px solid #ddd",
                        borderRadius: "4px", padding: "5px 10px", cursor: "pointer",
                        fontSize: "13px", fontFamily: "'Georgia', serif",
                      }}>Cancel</button>
                      {renameError && <span style={{ color: "red", fontSize: "12px" }}>{renameError}</span>}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold", color: "#111" }}>
                        {s.searchName || "Unnamed Search"}
                      </span>
                      <button onClick={() => startEdit(s)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "13px", color: "#aaa", padding: "0 4px",
                      }} title="Rename">✏️</button>
                    </div>
                  )}
                  <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                    {s.academic?.majorLabel || "—"}
                    {s.academic?.minor && ` · Minor: ${s.academic.minor}`}
                  </div>
                  {s.additional?.expectedGraduationDate && (
                    <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
                      Graduating: {s.additional.expectedGraduationDate}
                    </div>
                  )}
                  {/*Expiration for unstarred searches*/}
                  {!s.starred && s.expiresAt && (
                    <div style={{fontSize: "12px", color: "#C05A00", marginTop: "6px", fontWeight: "bold"}}>
                      Expires: {formatExpiry(s.expiresAt)}
                    </div>
                  )}
                </div>

                {/* Right: select button */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <StarButtonToggle
                    search={s}
                    showLabel={true}
                    onUpdated={handleSearchUpdated}
                    variant="pill"
                  />

                  <button
                    onClick={() => onSelect(s)}
                    style={{
                      backgroundColor: "#F97000",borderLeft: "4px solid #2E03A5",
                      color: "white",
                      border: "none",
                      borderRadius: "20px",
                      padding: "10px 24px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontFamily: "'Georgia', serif",
                      boxShadow: "0 2px 8px rgba(249,112,0,0.3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Load Search →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}