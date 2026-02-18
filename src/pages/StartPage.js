
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"
import '../components/CenteredButton.css';

// Login Page
export function StartUp(){
    const navigate = useNavigate();
    return (
        <div>
            <div className="center-container">
                <Link to="/login">
                    <button className="large-button">
                        Login
                    </button>
                </Link>
                <Link to="/login2">
                    <button className="large-button">
                        Login With Gatorlink
                    </button>
                </Link>
                <Link to="/signup">
                    <button className="large-button">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
}