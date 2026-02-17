// References: https://stackoverflow.com/questions/41080481/in-reactjs-how-to-invoke-link-click-via-button-press

import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom"

export function NavBar(){
    const items = ['LoginPage', 'MajorListPage'];
    const pages = ['/', '/home']

    return (
        <nav className="navbar">
            {items.map((item, index) => (
                <Link to={pages.at(index)}>
                    <button key={index} className="navbar-item">{item}</button>
                </Link>
            ))}
            </nav>
    );
}