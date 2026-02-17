
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component

import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"

// Login Page
export function Page1(){
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!email){ // Ensuring Email Validation
            setError("Email Required.");
            return;
        }
        setError("");
        let result = await fetch("http://localhost:5000/register", {
            method: "post",
            body: JSON.stringify({ name, email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        if (!result.ok){ // Email Validation Duplication
            setError("Email In Use");
        }           
        alert("Data saved successfully");
        setEmail("");
        setName("");
        navigate("/home"); // Navigating back home after sign-up/log-in
    }
    return (
        <>
            <h1>This is React WebApp </h1>
            <form action="">
                <input placeholder="name" 
                value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="email" 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" 
                onClick={handleOnSubmit}>submit</button>
                {error && <p style={{ color:'red' }}>{error}</p>}
            </form>

        </>
    );
}