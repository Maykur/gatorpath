
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"

// Sign-In Page
export function SignUp(){
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()){ // Ensuring Email Validation
            setError("Email Required.");
            return;
        }
        if (!name.trim()){
            setError("Name Required.");
            return;
        }
        if (!password.trim()){
            setError("Password Required.");
            return;
        }
        setError("");
        let result = await fetch("http://localhost:5000/register", {
            method: "post",
            body: JSON.stringify({ name, email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await result.json();
        if (!result.ok){ // Email Validation Duplication
            setError("Email In Use");
            return;
        }
        alert("Sign-In Saved Successfully");
        if (result.ok){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home"); // Navigating back home after sign-up/log-in
        }
    }
    return (
        <>
            <h1>Sign Up</h1>
            <form action="">
                <input placeholder="name" 
                value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder="email" 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="password" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit"
                onClick={handleOnSubmit}>submit</button>
                {error && <p style={{ color:'red' }}>{error}</p>}
            </form>
            <Link to="/">Go Back to Login</Link>
        </>
    );
}