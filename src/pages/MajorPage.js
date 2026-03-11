import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import { baseUrl } from "../constants";

export function MajorPage(){
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

    console.log(id);
    if (loading) return <div>Loading...</div>;
    if (!majorInfo) return <div>Major not found</div>;

    return (
        <div style={{
            padding: "100px 30px 100px 30px", // Top padding for navbar, extra bottom padding
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#ffffff",
            color: "#333333"
        }}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <button style={{
                    backgroundColor: "#0021A5",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "30px",
                    transition: "background-color 0.2s"
                }}>
                    ← Back to Home
                </button>
            </Link>

            <h1 style={{
                color: "#0021A5",
                borderBottom: "3px solid #FA4616",
                paddingBottom: "15px",
                marginBottom: "20px",
                fontSize: "28px",
                fontWeight: "600",
                letterSpacing: "-0.5px"
            }}>
                {majorInfo.major}
            </h1>
            
            <p style={{ 
                fontSize: "16px", 
                color: "#666666", 
                marginBottom: "40px",
                fontWeight: "500"
            }}>
                {majorInfo.university}
            </p>

            {/* Core Coursework */}
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{
                    backgroundColor: "#0021A5",
                    color: "white",
                    padding: "15px 20px",
                    borderRadius: "4px",
                    margin: "0 0 20px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    letterSpacing: "0.5px"
                }}>
                    CORE COURSEWORK
                </h2>
                <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "4px",
                    border: "1px solid #e9ecef"
                }}>
                    {majorInfo.core_coursework && majorInfo.core_coursework.map((course, index) => (
                        <div key={index} style={{
                            padding: "15px",
                            margin: "10px 0",
                            backgroundColor: "white",
                            borderRadius: "3px",
                            border: "1px solid #dee2e6",
                            borderLeft: "3px solid #0021A5"
                        }}>
                            <strong style={{ 
                                color: "#0021A5", 
                                fontSize: "14px",
                                fontWeight: "600"
                            }}>
                                {course.code}
                            </strong>
                            <span style={{ color: "#666", margin: "0 8px" }}>—</span>
                            <span style={{ color: "#333" }}>{course.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Foundation */}
            {majorInfo.required_foundation && majorInfo.required_foundation.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                    <h2 style={{
                        backgroundColor: "#FA4616",
                        color: "white",
                        padding: "15px 20px",
                        borderRadius: "4px",
                        margin: "0 0 20px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        letterSpacing: "0.5px"
                    }}>
                        REQUIRED FOUNDATION
                    </h2>
                    <div style={{
                        backgroundColor: "#f8f9fa",
                        padding: "20px",
                        borderRadius: "4px",
                        border: "1px solid #e9ecef"
                    }}>
                        {majorInfo.required_foundation.map((course, index) => (
                            <div key={index} style={{
                                padding: "15px",
                                margin: "10px 0",
                                backgroundColor: "white",
                                borderRadius: "3px",
                                border: "1px solid #dee2e6",
                                borderLeft: "3px solid #FA4616"
                            }}>
                                <strong style={{ 
                                    color: "#FA4616",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                }}>
                                    {course.code}
                                </strong>
                                <span style={{ color: "#666", margin: "0 8px" }}>—</span>
                                <span style={{ color: "#333" }}>{course.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Elective Areas */}
            {majorInfo.elective_areas && majorInfo.elective_areas.length > 0 && (
                <div style={{ marginBottom: "60px" }}>
                    <h2 style={{
                        backgroundColor: "#2c3e50",
                        color: "white",
                        padding: "15px 20px",
                        borderRadius: "4px",
                        margin: "0 0 20px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        letterSpacing: "0.5px"
                    }}>
                        ELECTIVE AREAS
                    </h2>
                    <div style={{
                        backgroundColor: "#f8f9fa",
                        padding: "20px",
                        borderRadius: "4px",
                        border: "1px solid #e9ecef"
                    }}>
                        {majorInfo.elective_areas.map((area, index) => (
                            <div key={index} style={{
                                padding: "15px",
                                margin: "10px 0",
                                backgroundColor: "white",
                                borderRadius: "3px",
                                border: "1px solid #dee2e6",
                                borderLeft: "3px solid #0021A5"
                            }}>
                                <span style={{ 
                                    color: "#333",
                                    fontWeight: "500"
                                }}>
                                    {area}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}