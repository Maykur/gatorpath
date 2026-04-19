import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../constants";
import StarButtonToggle from "../components/StarButtonToggle";
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

const texture = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a96e' fill-opacity='0.10'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

export default function PastSearchesPage() {
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;

  const [saved, setSaved] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [hoveredTrashId, setHoveredTrashId] = useState(null);
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

  const loadSaved = useCallback(async () => {
    setError("");
    const token = sessionStorage.getItem("token");
    if (!token) return navigate("/searches");
    const res = await fetch(`${baseUrl}/searches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) { setError(data?.message || "Failed to load saved searches"); return; }
    setSaved(Array.isArray(data) ? data : []);
  }, [navigate]);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  async function onSelect(search) {
    navigate("/dashboard", { state: { activeSearch: search } });
  }

  function startEdit(s) {
    setEditingId(s._id);
    setEditingName(s.searchName || "");
    setRenameError("");
  }

  async function saveRename(id) {
    const token = sessionStorage.getItem("token");
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

  async function handleDelete() {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${baseUrl}/searches/${deleteTargetId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setError("Failed to delete search. Try again."); setDeleteTargetId(null); return; }
    setSaved((prev) => prev.filter((s) => s._id !== deleteTargetId));
    setDeleteTargetId(null);
  }

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: t.bg, backgroundImage: texture,
      fontFamily: "'Georgia', serif", paddingTop: "80px",
    }}>
      {/* Header */}
      <div style={{ padding: "32px 40px 0" }}>
        <h1 style={{
          fontSize: "36px", fontWeight: "bold", color: t.accent,
          letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px 0",
          textShadow: "1px 2px 6px rgba(180,180,200,0.4)",
        }}>
          Saved Searches
        </h1>
        <p style={{ color: t.textMuted, fontSize: "14px", margin: "0 0 28px 0", letterSpacing: "1px" }}>
          Your starred career path searches
        </p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <button onClick={() => navigate("/search")} style={{
            backgroundColor: t.orange, color: "white", border: "none",
            borderRadius: "24px", padding: "10px 24px", fontSize: "14px",
            fontWeight: "bold", cursor: "pointer", fontFamily: "'Georgia', serif",
            boxShadow: "0 3px 10px rgba(249,112,0,0.3)",
          }}>
            + New Search
          </button>
          <button onClick={() => navigate("/dashboard")} style={{
            backgroundColor: "transparent", color: t.accent,
            border: `2px solid ${t.accent}`, borderRadius: "24px",
            padding: "10px 24px", fontSize: "14px", fontWeight: "bold",
            cursor: "pointer", fontFamily: "'Georgia', serif",
          }}>
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: t.card, borderRadius: "12px", padding: "36px 40px",
            boxShadow: t.shadow, maxWidth: "380px", width: "90%",
            fontFamily: "'Georgia', serif", textAlign: "center",
            border: `1px solid ${t.border}`,
          }}>
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: t.text, marginBottom: "10px" }}>
              Delete this search?
            </h3>
            <p style={{ fontSize: "14px", color: t.textMuted, lineHeight: "1.6", marginBottom: "28px" }}>
              This will permanently remove the search. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setDeleteTargetId(null)} style={{
                padding: "10px 24px", borderRadius: "20px", border: `1px solid ${t.border}`,
                backgroundColor: t.card, color: t.text, fontSize: "14px",
                fontFamily: "'Georgia', serif", cursor: "pointer", fontWeight: "600",
              }}>
                Cancel
              </button>
              <button onClick={handleDelete} style={{
                padding: "10px 24px", borderRadius: "20px", border: "none",
                backgroundColor: "#e53e3e", color: "white", fontSize: "14px",
                fontFamily: "'Georgia', serif", cursor: "pointer", fontWeight: "600",
                boxShadow: "0 3px 10px rgba(229,62,62,0.35)",
              }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "0 40px 40px" }}>
        {error && <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}

        {saved.length === 0 ? (
          <div style={{
            backgroundColor: t.card, borderRadius: "10px",
            padding: "60px", textAlign: "center", boxShadow: t.shadow,
            border: `1px solid ${t.border}`,
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <div style={{ fontSize: "18px", color: t.text, fontWeight: "bold" }}>No saved searches yet</div>
            <div style={{ fontSize: "14px", color: t.textMuted, marginTop: "8px" }}>
              Star a search from the dashboard to save it here
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {saved.map((s) => (
              <div key={s._id} style={{
                backgroundColor: isDark ? "rgba(30,30,50,0.97)" : "rgba(255,255,255,0.97)",
                borderRadius: "8px",
                padding: "20px 24px", boxShadow: t.shadow,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "16px", flexWrap: "wrap",
                borderLeft: `4px solid ${t.accent}`,
                border: `1px solid ${t.border}`,
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
                          fontSize: "16px", fontWeight: "bold", color: t.text,
                          border: `2px solid ${t.accent}`, borderRadius: "4px",
                          padding: "4px 10px", fontFamily: "'Georgia', serif",
                          outline: "none", backgroundColor: t.inputBg,
                        }}
                      />
                      <button onClick={() => saveRename(s._id)} style={{
                        backgroundColor: t.accent, color: "white", border: "none",
                        borderRadius: "4px", padding: "5px 14px", cursor: "pointer",
                        fontSize: "13px", fontFamily: "'Georgia', serif",
                      }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{
                        backgroundColor: "transparent", color: t.textMuted, border: `1px solid ${t.border}`,
                        borderRadius: "4px", padding: "5px 10px", cursor: "pointer",
                        fontSize: "13px", fontFamily: "'Georgia', serif",
                      }}>Cancel</button>
                      {renameError && <span style={{ color: "red", fontSize: "12px" }}>{renameError}</span>}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold", color: t.text }}>
                        {s.searchName || "Unnamed Search"}
                      </span>
                      <button onClick={() => startEdit(s)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "13px", color: t.textLight, padding: "0 4px",
                      }} title="Rename">✏️</button>
                    </div>
                  )}
                  <div style={{ fontSize: "13px", color: t.textMuted, marginTop: "4px" }}>
                    {s.academic?.majorLabel || "—"}
                    {s.academic?.minor && ` · Minor: ${s.academic.minor}`}
                  </div>
                  {s.additional?.expectedGraduationDate && (
                    <div style={{ fontSize: "12px", color: t.textLight, marginTop: "2px" }}>
                      Graduating: {s.additional.expectedGraduationDate}
                    </div>
                  )}
                  {!s.starred && s.expiresAt && (
                    <div style={{ fontSize: "12px", color: "#C05A00", marginTop: "6px", fontWeight: "bold" }}>
                      Expires: {formatExpiry(s.expiresAt)}
                    </div>
                  )}
                </div>

                {/* Right: buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <StarButtonToggle search={s} showLabel={true} onUpdated={handleSearchUpdated} variant="pill" />

                  <div style={{ position: "relative" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTargetId(s._id); }}
                      onMouseEnter={() => setHoveredTrashId(s._id)}
                      onMouseLeave={() => setHoveredTrashId(null)}
                      style={{
                        background: "none", border: `1px solid ${hoveredTrashId === s._id ? "#e53e3e" : t.border}`,
                        borderRadius: "8px", cursor: "pointer", padding: "7px 10px",
                        color: hoveredTrashId === s._id ? "#e53e3e" : t.textLight,
                        backgroundColor: hoveredTrashId === s._id ? "#fff0f0" : "transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke={hoveredTrashId === s._id ? "#e53e3e" : t.textLight}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ display: "block", transition: "stroke 0.2s" }}
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                    {hoveredTrashId === s._id && (
                      <div style={{
                        position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                        transform: "translateX(-50%)", backgroundColor: "#333", color: "white",
                        fontSize: "12px", padding: "6px 12px", borderRadius: "6px",
                        whiteSpace: "nowrap", pointerEvents: "none", zIndex: 10,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}>
                        Permanently delete this search
                        <div style={{
                          position: "absolute", top: "100%", left: "50%",
                          transform: "translateX(-50%)", borderWidth: "5px",
                          borderStyle: "solid", borderColor: "#333 transparent transparent transparent",
                        }} />
                      </div>
                    )}
                  </div>

                  <button onClick={() => onSelect(s)} style={{
                    backgroundColor: t.orange, color: "white", border: "none",
                    borderRadius: "20px", padding: "10px 24px", fontSize: "14px",
                    fontWeight: "bold", cursor: "pointer", fontFamily: "'Georgia', serif",
                    boxShadow: "0 2px 8px rgba(249,112,0,0.3)", whiteSpace: "nowrap",
                  }}>
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