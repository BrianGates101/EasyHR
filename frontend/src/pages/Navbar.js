import React from 'react';
import { Link } from 'react-router-dom';
import '../styling/Navbar.css'

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/list">Employee List</Link></li>
                <li><Link to="/graph">Employee Graph</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
