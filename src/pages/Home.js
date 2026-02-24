import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom"
import SearchPage from "../components/SearchPage"
import Navbar from "../components/Navbar"
import StarButtonToggle from "../components/StarButtonToggle"

// Search bar test page
export function Home(){
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadLatest() {
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/searches");

    const res = await fetch("http://localhost:5000/searches/latest", {
      headers: {Authorization: `Bearer ${token}`},
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.message || "Failed to load latest search");
      return;
    }

    setLatest(null);
  }

  useEffect(() => {
    loadLatest();
  }, []);
  return (
    <>
        <h1>Home Page</h1>
        <Link to="/search">
          <button>
            Go to Search for Career Paths
          </button>
        </Link>

        <hr />

        <h2>Major Lookup (Temp)</h2>
        <SearchPage/>

        <hr />

        {/* Placeholder star toggle */}
        <div style={{ marginTop: 10 }}>
            <StarButtonToggle
                search={latest}
                onUpdated={(updated) => setLatest(updated)}
            />
        </div>
    </>
  );
}