import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Navbar.css'

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li className="navbar-item">
                    <Link to="/list" className="navbar-link">Employee List</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/graph" className="navbar-link">Employee Graph</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
