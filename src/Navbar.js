import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the Navbar-specific styles

function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="navbar-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            StudyAssistant
          </Link>
        </div>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/study-plan" className="navbar-link" onClick={closeMenu}>Study Plan</Link>
          </li>
          <li className="navbar-item">
            <Link to="/quiz" className="navbar-link" onClick={closeMenu}>Quiz</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
