
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"

// Login Page
export function LogIn(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()){ // Ensuring Email Validation
            setError("Email Required.");
            return;
        }
        if (!password.trim()){
            setError("Password Required.");
            return;
        }
        setError("");
        let result = await fetch("http://localhost:5000/login", {
            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await result.json();
        if (!result.ok){ // Email Validation Duplication
            setError("Invalid Email/Password");
            return;
        }
        if (result.ok){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home"); // Navigating back home after sign-up/log-in
        }
    }
    return (
        <>
            <h1>Login</h1>
            <form action="">
                <input placeholder="email" 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="password" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit"
                onClick={handleOnSubmit}>submit</button>
                {error && <p style={{ color:'red' }}>{error}</p>}
            </form>
            New here? <Link to="/signup">Click to Sign up!</Link>
        </>
    );
}