import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"

// Page that user is redirected towards after clicking on associated major
export function MajorPage(){
    const { id } = useParams();
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        async function fetchInfo() {
            let result = await fetch(`http://localhost:5000/data/major/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                },
            });
            const majorData = await result.json();
            const classData = [
                ...majorData.core_coursework,
                ...majorData.required_foundation
            ];
            setCourses(classData);
        }
        fetchInfo(); // Grabs major's class info based on id
    }, []);

    return (
        <div>
            <h1>hi</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.code}>
                        <strong>{course.code}</strong> -- {course.title}
                    </li>
                ))}
            </ul>        
            <Link to="/home">Go Back Home</Link>
        </div>
    )
}