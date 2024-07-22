import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <>
            <div className="top-nav">
                <Link className="active" to="/">Home</Link>
                <Link to="/news">News</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>
            </div>

            <div style={{ paddingLeft: "16px" }}>
                <h2>Top Navigation Example</h2>
                <p>Some content..</p>
            </div>
        </>
    );
}

export default Header;