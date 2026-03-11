/* REFERENCES:
https://www.openwebninja.com/api/jsearch/docs?_gl=1*1ns59is*_ga*MTQwODcyNDU3NS4xNzcyNjgyODgz*_ga_6N3TJCS0C6*czE3NzI2ODI4ODIkbzEkZzEkdDE3NzI2ODI5MDMkajM5JGwwJGgw#description/introduction
https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-bottom
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-bottom


*/
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // auto select current state unless select a different state
export function JobResults() {
    const location = useLocation();
    const [jobResults, setJobResults] = useState([]);
    const [error, setError] = useState(""); // do i need to change here
    const [loading, setLoading] = useState(true);
    const [selectState, setSelectState] = useState("Florida");
    // In case we want to have a dropdown to select and update the state by having user select
const statesOfUS = ["United States", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", 
    "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee","Texas","Utah",
    "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];  

    
    useEffect(() => {

        async function fetchResults() {

            try {

                setError("");
                setLoading(true);

                const params = new URLSearchParams(location.search);

                const major = params.get("major");
                if (!major) {
                    setError("Cannot fetch job results without a major");
                    setLoading(false);
                    return;
                }

                const minor = params.get("minor");
                const skills = params.get("skills");
                 const certificate = params.get("certifications");
                // const state = params.get("state");

                const query = new URLSearchParams({
                    major,
                    minor,
                    certificate,
                    skills,
                    state: selectState === "United States" ? "" : selectState
                });

                const response = await fetch(
                    `http://localhost:5000/jobListings?${query}`
                );

                const data = await response.json();

                setJobResults(data.jobs || []);

            } catch (err) {

                setError("Failed to load job results");

            } finally {

                setLoading(false);

            }
        }

        fetchResults();

    }, [location.search, selectState]); // if state changes update results? 

    return (

        <div>

            <h1>Job Possibilities and Recommendations</h1>

            {loading && <p>Loading jobs...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}
            
    <select name="state"
        value = {selectState}
        onChange={(e) => setSelectState(e.target.value)}>
        {statesOfUS.map((state) => (
            <option key={state} value={state}>
                {state}
            </option>
        ))}
    </select>

            <ul>
                {jobResults.map((job, index) => (
                    <li key={index} style={{marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px"}}>
                        <h3>{job.title}</h3>
                        <p>Salary: {job.salary}</p>
                        <p>Listings Found: {job.found}</p>
                    </li>
                ))}
            </ul>

        </div>
    );
}
