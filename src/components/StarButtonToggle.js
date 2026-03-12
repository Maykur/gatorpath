import React, {useState} from "react";
import { baseUrl } from "../constants";

export default function StarButtonToggle({ search, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggleStar() {
    if (!search?._id) return;
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setError("Not logged in."); setLoading(false); return; }
      const endpoint = search.starred ? "unstar" : "star";
      const res = await fetch(
        `${baseUrl}/searches/${search._id}/${endpoint}`,
        {
          method: "PATCH",
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update star status.");
      onUpdated?.(data);
    } catch (err) {
      console.error("Star toggle error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const starred = search?.starred;

  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={toggleStar}
        disabled={loading || !search?._id}
        title={starred ? "Unsave" : "Save"}
        style={{
          background: "none",
          border: "none",
          cursor: search?._id ? "pointer" : "default",
          padding: "4px",
          lineHeight: 1,
          opacity: !search?._id ? 0.4 : 1,
          transition: "transform 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <svg
          width="26" height="26" viewBox="0 0 24 24"
          fill={starred ? "#F97000" : "none"}
          stroke={starred ? "#F97000" : "#555"}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      {error && <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>{error}</div>}
    </div>
  );
}