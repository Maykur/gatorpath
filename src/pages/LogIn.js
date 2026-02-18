
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
// Referenced: https://stackoverflow.com/questions/45201351/masking-password-input-in-reactjs

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"
import '../components/CenteredButton.css';

// Login Page
export function LogIn(){
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleShow = () => {
        setShowPass(prev => !prev);
    }
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
            <div className="center-container">
                <h1>Login</h1>
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Email
                        </label>
                        <input type='text'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style = {{width: '708px', height: '81px', boxSizing: 'border-box', resize: 'none', fontSize: '30px'}}/>
                    </div>
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Password
                        </label>
                        <input type={showPass?'text':'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style = {{width: '708px', height: '81px', boxSizing: 'border-box', resize: 'none', fontSize: '30px'}}/>
                        <button className="small-button"
                            onClick={handleShow}>{showPass? "👀":"🕶️"}</button>
                    </div>
                    <button className="large-submit"
                    onClick={handleOnSubmit}>Login</button>
                    {error && <p style={{ color:'red' }}>{error}</p>}
            </div>
            New here? <Link to="/signup">Click to Sign up!</Link>
        </>
    );
}