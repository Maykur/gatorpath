import React, {useState} from "react";
import {baseUrl} from "../constants";

export default function StarButtonToggle({search, onUpdated, variant = "icon"}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggleStar() {
    if (!search?._id) return;

    setError("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Not logged in.");
        return;
      }

      const endpoint = search.starred ? "unstar" : "star";

      const res = await fetch(`${baseUrl}/searches/${search._id}/${endpoint}`, {
        method: "PATCH",
        headers: {Authorization: `Bearer ${token}`},
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update star status.");

      onUpdated?.(data);
    }
    catch (err) {
      console.error("Star toggle error:", err);
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  }

  const starred = !!search?.starred;
  const isPill = variant === "pill";

  return (
    <div style={{display: "inline-flex", flexDirection: "column", alignItems: "flex-start"}}>
      <button
        onClick={toggleStar}
        disabled={loading || !search?._id}
        title={starred ? "Unsave Search" : "Save Search"}
        style={
          isPill
            ? {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: starred ? "rgba(249,112,0,0.10)" : "transparent",
                color: starred ? "#F97000" : "#555",
                border: starred ? "1.5px solid #F97000" : "1.5px solid #bbb",
                borderRadius: "20px",
                padding: "8px 14px",
                cursor: search?._id ? "pointer" : "default",
                opacity: loading || !search?._id ? 0.7 : 1,
                fontFamily: "'Georgia', serif",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }
            : {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                padding: "0",
                margin: "0",
                cursor: search?._id ? "pointer" : "default",
                opacity: loading || !search?._id ? 0.7 : 1,
                boxShadow: "none",
              }
        }
      >
        <svg
          width={isPill ? "18" : "24"}
          height={isPill ? "18" : "24"}
          viewBox="0 0 24 24"
          fill={starred ? "#F97000" : "none"}
          stroke={starred ? "#F97000" : "#777"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>

        {isPill && <span>{starred ? "Unsave Search" : "Save Search"}</span>}
      </button>

      {error && (
        <div style={{color: "red", marginTop: 6, fontSize: 12}}>{error}</div>
      )}
    </div>
  );
}
