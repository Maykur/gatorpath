import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { baseUrl } from "../constants";
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../context/theme";

export function MajorPage() {
    const { isDark } = useTheme();
    const t = isDark ? darkTheme : lightTheme;

    const { id } = useParams();
    const [majorInfo, setMajorInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInfo() {
            try {
                let result = await fetch(`${baseUrl}/majors/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type" : "application/json",
                    },
                });
                const majorData = await result.json();
                setMajorInfo(majorData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching major info:", error);
                setLoading(false);
            }
        }
        fetchInfo();
    }, [id]);

    if (loading) return (
        <div style={{ minHeight: "100vh", backgroundColor: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: t.textMuted, fontSize: "18px" }}>
            Loading...
        </div>
    );

    if (!majorInfo) return (
        <div style={{ minHeight: "100vh", backgroundColor: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: t.textMuted, fontSize: "18px" }}>
            Major not found
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            padding: "100px 40px 60px",
            fontFamily: "'Georgia', serif",
            backgroundColor: t.bg,
            color: t.text,
        }}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button style={{
                    backgroundColor: t.accent, color: "white", border: "none",
                    padding: "12px 20px", borderRadius: "4px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "600", marginBottom: "30px",
                    fontFamily: "'Georgia', serif",
                }}>
                    ← Back to Dashboard
                </button>
            </Link>

            <h1 style={{
                color: t.accent, borderBottom: `3px solid ${t.orange}`,
                paddingBottom: "15px", marginBottom: "10px",
                fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px",
            }}>
                {majorInfo.major}
            </h1>

            <p style={{ fontSize: "16px", color: t.textMuted, marginBottom: "40px", fontWeight: "500" }}>
                {majorInfo.university}
            </p>

            {/* Core Coursework */}
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{
                    backgroundColor: t.accent, color: "white",
                    padding: "15px 20px", borderRadius: "4px",
                    margin: "0 0 20px 0", fontSize: "18px",
                    fontWeight: "600", letterSpacing: "0.5px",
                }}>
                    CORE COURSEWORK
                </h2>
                <div style={{ backgroundColor: t.cardSolid, padding: "20px", borderRadius: "4px", border: `1px solid ${t.border}` }}>
                    {majorInfo.core_coursework && majorInfo.core_coursework.map((course, index) => (
                        <div key={index} style={{
                            padding: "15px", margin: "10px 0",
                            backgroundColor: t.card, borderRadius: "3px",
                            border: `1px solid ${t.border}`,
                            borderLeft: `3px solid ${t.accent}`,
                        }}>
                            <strong style={{ color: t.accent, fontSize: "14px", fontWeight: "600" }}>{course.code}</strong>
                            <span style={{ color: t.textMuted, margin: "0 8px" }}>—</span>
                            <span style={{ color: t.text }}>{course.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Foundation */}
            {majorInfo.required_foundation && majorInfo.required_foundation.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{
                        backgroundColor: t.orange, color: "white",
                        padding: "15px 20px", borderRadius: "4px",
                        margin: "0 0 20px 0", fontSize: "18px",
                        fontWeight: "600", letterSpacing: "0.5px",
                    }}>
                        REQUIRED FOUNDATION
                    </h2>
                    <div style={{ backgroundColor: t.cardSolid, padding: "20px", borderRadius: "4px", border: `1px solid ${t.border}` }}>
                        {majorInfo.required_foundation.map((course, index) => (
                            <div key={index} style={{
                                padding: "15px", margin: "10px 0",
                                backgroundColor: t.card, borderRadius: "3px",
                                border: `1px solid ${t.border}`,
                                borderLeft: `3px solid ${t.orange}`,
                            }}>
                                <strong style={{ color: t.orange, fontSize: "14px", fontWeight: "600" }}>{course.code}</strong>
                                <span style={{ color: t.textMuted, margin: "0 8px" }}>—</span>
                                <span style={{ color: t.text }}>{course.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Elective Areas */}
            {majorInfo.elective_areas && majorInfo.elective_areas.length > 0 && (
                <div style={{ marginBottom: "60px" }}>
                    <h2 style={{
                        backgroundColor: t.cardSolid, color: t.text,
                        padding: "15px 20px", borderRadius: "4px",
                        margin: "0 0 20px 0", fontSize: "18px",
                        fontWeight: "600", letterSpacing: "0.5px",
                        border: `1px solid ${t.border}`,
                    }}>
                        ELECTIVE AREAS
                    </h2>
                    <div style={{ backgroundColor: t.cardSolid, padding: "20px", borderRadius: "4px", border: `1px solid ${t.border}` }}>
                        {majorInfo.elective_areas.map((area, index) => (
                            <div key={index} style={{
                                padding: "15px", margin: "10px 0",
                                backgroundColor: t.card, borderRadius: "3px",
                                border: `1px solid ${t.border}`,
                                borderLeft: `3px solid ${t.border}`,
                            }}>
                                <span style={{ color: t.text, fontWeight: "500" }}>{area}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}