// References: https://stackoverflow.com/questions/41080481/in-reactjs-how-to-invoke-link-click-via-button-press

import React from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom"

export function NavBar(){
    const location = useLocation();
    const navigate = useNavigate();
    const items = ['LoginPage', 'MajorListPage'];
    const pages = ['/', '/home']
    const loggedIn = !!localStorage.getItem("token");
    let user = null;
    const storeUser = localStorage.getItem("user");
    if(storeUser){
        try{
            user = JSON.parse(storeUser);
        }catch(e){
            console.error("Failed to parse", e);
            user = null;
        }
    }
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }
    return (
        <nav className="navbar">
            <div className="navbar-left">
                {items.map((item, index) => {
                    if (!loggedIn){
                        if(index === 0){
                            return(
                                <Link to={pages.at(index)}>
                                    <button key={index} className="navbar-item">Sign Up/Login Page</button>
                                </Link>
                            );
                        }
                    } else {
                       if(index != 0){
                            return(
                                <Link to={pages.at(index)}>
                                    <button key={index} className="navbar-item">{item}</button>
                                </Link>
                            );
                        } 
                    }
                })}
            </div>
            {loggedIn && (
                <div className="navbar-right">
                    {user?(
                        <span className="navbar-user">Hi, {user.name}</span>) : (
                            <span className="navbar-user">SIGN IN</span>
                        )
                    }
                    <button className="navbar-item" onClick={handleSignOut}>Sign Out</button>
                </div>              
            )}
        </nav>
    );
}