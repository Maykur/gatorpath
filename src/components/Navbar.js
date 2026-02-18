// References: https://stackoverflow.com/questions/41080481/in-reactjs-how-to-invoke-link-click-via-button-press

import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom"

export function NavBar(){
    const navigate = useNavigate();
    const items = ['LoginPage', 'MajorListPage'];
    const pages = ['/', '/home']
    const loggedIn = !!localStorage.getItem("token");
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
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
                                    <button key={index} className="navbar-item">{item}</button>
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
                    <span className="navbar-user">Hi, {user.name}</span>
                    <button className="navbar-item" onClick={handleSignOut}>Sign Out</button>
                </div>              
            )}
        </nav>
    );
}