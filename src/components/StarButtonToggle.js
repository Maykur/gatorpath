import React, {useState} from "react";

// Toggle button to star/unstar the latest search submission
export default function StarButtonToggle({search, onUpdated}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handler for toggling star status
  async function toggleStar() {
    if (!search?._id) {
        return;
    }

    setError("");
    setLoading(true);

    // Check for token, if not present show error
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      // Determine endpoint based on current starred status
      const endpoint = search.starred ? "unstar" : "star";

      // Make API call to toggle star status
      const res = await fetch(
        `http://localhost:5000/searches/${search._id}/${endpoint}`,
        {
          method: "PATCH",
          headers: {Authorization: `Bearer ${token}`},
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update star status.");
      }

      // Send updated data back to parent
      onUpdated?.(data);
    }
    // Handle errors
    catch (err) {
      console.error("Star toggle error:", err);
      setError(err.message);
    }
    // Reset loading state
    finally {
      setLoading(false);
    }
  }

  const label = search?.starred ? "Unsave" : "Save";

  return (
    <div style={{display: "inline-block"}}>
      <button onClick={toggleStar} disabled={loading || !search?._id}>
        {loading ? "Updating..." : label}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: 6, fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
}
