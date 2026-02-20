// Referenced: https://www.scaler.com/topics/react/react-searchbar/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"

// Used as a template on search bar -> Connected to a basic major/class-related info DB
function SearchPage() {
    const [searching, setSearching] = useState("");
    const [info, setInfo] = useState([]);
    useEffect(() => {
        async function fetchInfo() {
            let result = await fetch("http://localhost:5000/majors", {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                },
            });
            const data = await result.json();
            setInfo(data);
        }
        fetchInfo(); // Grabs all the majors listed in db 
    }, []);
    return (
        // Filters the major list (results) by the searched query (searching)
        <div>
            <input placeholder="Search For Major:" 
            value={searching} onChange={(e) => setSearching(e.target.value)}/>
        <div>{
            info.length && info.filter((results) => {
                if (searching === "") {
                    return results;
                } 
                else if (results.major.toLowerCase().includes(searching.toLowerCase())) {
                    return results;
                }
            }).map((results) => (
                <li key={results._id}>
                    <Link to={`/majors/${results._id}`}>
                        {results.major}
                    </Link>
                </li>
            ))}
        </div>
    </div>
  );
}

export default SearchPage;
