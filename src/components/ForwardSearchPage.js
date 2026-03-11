import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function ForwardSearchPage() {
    const navigate = useNavigate();

    // majors list
    const [majors, setMajors] = useState([]);

    // minors list
    const [minors, setMinors] = useState([]);

    // certs list
    const [certificates, setCerts] = useState([]);

    // Section A
    const [majorId, setMajorId] = useState("");
    const [minorIds, setMinorIds] = useState([]);
    const [certificateIds, setCertificateIds] = useState([]);
    const [coursesTakenText, setCoursesTakenText] = useState(""); 

    // Section B
    const [expectedGraduationDate, setExpectedGraduationDate] = useState("");
    const [coursePreference, setCoursePreference] = useState("");
    const [searchName, setSearchName] = useState("");

    // UI state
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Get minor and cert options from state
    const minorList = minors.map(n => ({ value: n._id, label: n.program_name }));
    const certList = certificates.map(c => ({ value: c._id, label: c.program_name }));

    // Fetch majors for dropdown
    useEffect(() => {
        (async () => {
        try {
            const res = await fetch("http://localhost:5000/majors");
            const data = await res.json();
            setMajors(Array.isArray(data) ? data : []);
        } 
        catch (err) {
            console.error(err);
            setError("Failed to load majors.");
        }
        })();
    }, []);

    // Fetch Minors for dropdown
    useEffect(() => {
        (async () => {
        try {
            const res = await fetch("http://localhost:5000/programs?type=Minor");
            const data = await res.json();
            setMinors(Array.isArray(data) ? data : []);
        } 
        catch (err) {
            console.error(err);
            setError("Failed to load minors.");
        }
        })();
    }, []);

    // Fetch certificates for dropdown
    useEffect(() => {
        (async () => {
        try {
            const res = await fetch("http://localhost:5000/programs?type=Certificate");
            const data = await res.json();
            setCerts(Array.isArray(data) ? data : []);
        } 
        catch (err) {
            console.error(err);
            setError("Failed to load certificates.");
        }
        })();
    }, []);

    // Parser for courses taken input
    function parseCoursesTaken(input) {
        // Comma-separated course codes, ex: "CIS4301, CIS4914"
        const codes = input.split(",").map((s) => s.trim()).filter(Boolean);

        // Backend schema expects {code, title (Optional)}
        return codes.map((code) => ({code, title: ""}));
    }

    // Form submission handler
    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        // majorID required
        if (!majorId) {
            setError("Major is required.");
            return;
        }

        // Make sure user is authenticated
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You are not logged in.");
            navigate("/login");
            return;
        }

        // Constructed payload based on backend schema
        const payload = {
            searchName,
            academic: {
                majorId,
                minorIds,
                certificateIds,
                coursesTaken: parseCoursesTaken(coursesTakenText),
            },
            additional: {
                expectedGraduationDate,
                coursePreference,
            },
        };

        console.log("PAYLOAD BEING SENT:", payload);

        try {
            // Submit search to backend Through POST /searches
            setSubmitting(true);
            const res = await fetch("http://localhost:5000/searches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            // Handle response
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to submit search.");
            }

            // For now, just go home
            const params = new URLSearchParams();

        const selectedMajor = majors.find(m => m._id === majorId);

        // Trim and select major from list
        if (selectedMajor) {
            const simplifiedMajor = selectedMajor.major
            .split("(")[0]     // remove "(CPE)"
            .split("-")[0]     // remove "- BSCoE"
            .trim();

            params.append("major", simplifiedMajor);
        }

        // Add minors, certs, and skills ot dashboard
        if (minorIds.length > 0) params.append("minor", minorIds.map(id => minorList.find(m => m.value === id)?.label).join(","));
        if (certificateIds.length > 0) params.append("certificate", certificateIds.map(id => certList.find(c => c.value === id)?.label).join(","));
        if (coursesTakenText) params.append("skills", coursesTakenText);

        navigate(`/jobResults?${params.toString()}&state=Florida`);
        }
        catch (err) {
            console.error(err);
            setError(err.message);
        }
        // Set submitting to false in success and error cases
        finally {
            setSubmitting(false);
        }
    }
    return (
        <div style={{padding: 24}}>
            <h1>Academic to Career Search</h1>

            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                <h3>Section A: Academic Information</h3>

                <label>
                    Major (Required)
                    <Select
                        options={majors.map(m => ({ value: m._id, label: m.major }))}
                        onChange={(selected) => setMajorId(selected ? selected.value : "")}
                        placeholder="Select a major..."
                        isClearable
                     />
                </label>

                <label>
                    Minor (Select Multiple)
                    <Select
                        isMulti
                        options={minorList}
                        onChange={(selected) => setMinorIds(selected.map(s => s.value))}
                        placeholder="Select minor(s)..."
                    />
                </label>

                <label>
                    Certificate (Select Multiple)
                    <Select
                        isMulti
                        options={certList}
                        onChange={(selected) => setCertificateIds(selected.map(s => s.value))}
                        placeholder="Select certificates(s)..."
                    />
                </label>

                <label>
                    Courses Taken (comma-separated codes)
                    <input
                        placeholder="e.g., CIS4301, CIS4914"
                        value={coursesTakenText}
                        onChange={(e) => setCoursesTakenText(e.target.value)}
                    />
                </label>

                <h3>Section B: Additional</h3>

                <label>
                    Expected Graduation Date
                    <input
                        placeholder="e.g., Fall 2026"
                        value={expectedGraduationDate}
                        onChange={(e) => setExpectedGraduationDate(e.target.value)}
                    />
                </label>

                <label>
                    Course Preferences
                    <input
                        placeholder="e.g., Project Oriented"
                        value={coursePreference}
                        onChange={(e) => setCoursePreference(e.target.value)}
                    />
                </label>

                <label>
                    Search Name (nickname)
                    <input
                        placeholder="e.g., CS_with_DS_and_AI"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </label>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Search"}
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/past-searches")}
                    style={{
                        marginBottom: 16,
                        padding: "8px 14px",
                        cursor: "pointer"
                    }}
                    >
                    View Past Searches
                </button>
            </form>
        </div>
    );
}
