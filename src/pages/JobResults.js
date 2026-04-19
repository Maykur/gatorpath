/* REFERENCES:
https://www.openwebninja.com/api/jsearch/docs?_gl=1*1ns59is*_ga*MTQwODcyNDU3NS4xNzcyNjgyODgz*_ga_6N3TJCS0C6*czE3NzI2ODI4ODIkbzEkZzEkdDE3NzI2ODI5MDMkajM5JGwwJGgw#description/introduction
https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-bottom
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-bottom


*/
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // auto select current state unless select a different state
import {baseUrl} from '../constants.js'
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

export function JobResults() {
    const { isDark } = useTheme();
    const t = isDark ? darkTheme : lightTheme;

    const location = useLocation();
    const [jobResults, setJobResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(""); // do i need to change here
    const [loading, setLoading] = useState(true);
    const [selectState, setSelectState] = useState("Florida");
    const SENIORITY_OPTIONS = ["All", "Internship", "Junior", "Mid Level", "Senior", "Lead", "Manager"];
    const [locationFilter, setLocationFilter] = useState("");
    const [seniorityFilter, setSeniorityFilter] = useState("All");

    // In case we want to have a dropdown to select and update the state by having user select
    const statesOfUS = ["United States", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", 
    "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee","Texas","Utah",
    "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];  

    
   // Format salary if its not a range
    function formatSalary(salary) {
    if (!salary || salary === "N/A") return "N/A";

    const parts = salary.split("-").map((part) => part.trim());
    if (parts.length === 2 && parts[0] === parts[1]) {
        return parts[0];
    }

    return salary;
}

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
                const courses = params.get("courses");
                const certificate = params.get("certificate");
                // const state = params.get("state");

                const query = new URLSearchParams({
                    major,
                    minor,
                    certificate,
                    courses,
                    state: selectState === "United States" ? "" : selectState
                });

                const response = await fetch(
                    `${baseUrl}/jobListings?${query}`
                );

                const data = await response.json();

                setJobResults(data.jobs || []);
                // Store reccomendations
                setRecommendations(data.recommendedCareers || []);

            } catch (err) {

                setError("Failed to load job results");

            } finally {

                setLoading(false);

            }
        }

        fetchResults();

    }, [location.search, selectState]); // if state changes update results? 

    useEffect(() => {
    if (jobResults.length > 0) {
        console.log("Sample salary:", jobResults[0].salary, typeof jobResults[0].salary);
    }
}, [jobResults]);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: t.bg, fontFamily: "'Georgia', serif", padding: "40px" }}>
            <h1 style={{ color: t.accent, fontSize: "32px", marginBottom: "24px" }}>Job Possibilities and Recommendations</h1>

            {loading && <p style={{ color: t.textMuted }}>Loading jobs...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            
    <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <select name="state"
            value = {selectState}
            onChange={(e) => setSelectState(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "20px", border: `1px solid ${t.border}`, fontSize: "13px", backgroundColor: t.inputBg, color: t.text, fontFamily: "'Georgia', serif", cursor: "pointer" }}>
            {statesOfUS.map((state) => (
                <option key={state} value={state}>{state}</option>
            ))}
        </select>

        <select value={seniorityFilter} onChange={(e) => setSeniorityFilter(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "20px", border: `1px solid ${t.border}`, fontSize: "13px", backgroundColor: t.inputBg, color: t.text, fontFamily: "'Georgia', serif", cursor: "pointer" }}>
            {SENIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        <input
            placeholder="Filter by city/state..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "20px", border: `1px solid ${t.border}`, fontSize: "13px", backgroundColor: t.inputBg, color: t.text, fontFamily: "'Georgia', serif", outline: "none" }}
        />
    </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {jobResults.filter(job => {
                    if (seniorityFilter !== "All" && job.seniority !== seniorityFilter) return false;
                    if (locationFilter && !job.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
                    return true;
                }).map((job, index) => (
                    <li key={index} style={{
                        marginBottom: "16px", borderBottom: `1px solid ${t.border}`,
                        paddingBottom: "16px", backgroundColor: t.card,
                        borderRadius: "8px", padding: "20px", boxShadow: t.shadow,
                    }}>
                        <h3 style={{ color: t.accent, marginBottom: "8px", fontSize: "18px" }}>{job.title}</h3>
                        <p style={{ color: t.text, fontSize: "14px", margin: "4px 0" }}>Salary: {formatSalary(job.salary)}</p>
                        <p style={{ color: t.text, fontSize: "14px", margin: "4px 0" }}>Listings Found: {job.found}</p>
                        <p style={{ color: t.text, fontSize: "14px", margin: "4px 0" }}>Location: {job.location || "N/A"}</p>
                        <p style={{ color: t.text, fontSize: "14px", margin: "4px 0" }}>Seniority: {job.seniority || "N/A"}</p>
                    </li>
                ))}
            </ul>

        </div>
    );

}
