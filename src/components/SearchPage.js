// Referenced: https://www.scaler.com/topics/react/react-searchbar/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { baseUrl } from "../constants";

// enter in info for search bar (major options)
function SearchPage() {
    const [searching, setSearching] = useState("");
    const [info, setInfo] = useState([]);
    useEffect(() => {
        async function fetchMoreInfo() {
            let result = await fetch(`${baseUrl}/majors`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                },
            });
            const data = await result.json();
            setInfo(data);
            }
            fetchMoreInfo(); // Grabs all the majors listed in db 
    }, []);
    return (
        // Filters the major list (results) by the searched query (searching)
        <div>
            <input placeholder="Search For Major:" 
            value={searching} onChange={(e) => setSearching(e.target.value)}/>
        <div>{
            info.filter((r) => {
                if (!searching) return true;
                return r.major?.toLowerCase().includes(searching.toLowerCase());
            })
            .map((r) => (
                <li key={r._id}>
                    <Link to={`/majors/${r._id}`}>{r.major}</Link>
                </li>
            ))}
        </div>
    </div>
  );
}

export default SearchPage;
