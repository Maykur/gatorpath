
// Frontend code (BASE FROM GEEKSFORGEEKS)

import { useNavigate } from "react-router-dom"
import { useState } from 'react'

export function Page1(){
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let result = await fetch(
        'http://localhost:5000/register', {
            method: "post",
            body: JSON.stringify({ name, email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved successfully");
            setEmail("");
            setName("");
            navigate("/home"); // Navigating back home after sign-up/log-in
        }
    }
    return (
        <>
            <h1>This is React WebApp </h1>
            <form action="">
                <input type="text" placeholder="name" 
                value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="email" 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" 
                onClick={handleOnSubmit}>submit</button>
            </form>

        </>
    );
}