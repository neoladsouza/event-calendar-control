import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";

export default function Navigation() {
  return (
    <header>
      <div className="logo">Emmaus Wellness</div>
      <nav>
        <Link to="/"><button className="linked-button nav-button">Home</button></Link>
        <Link to="/about"><button className="linked-button nav-button">About</button></Link>
        <Link to="/events"><button className="linked-button nav-button">Events</button></Link>
      </nav>
    </header>
  );
};
