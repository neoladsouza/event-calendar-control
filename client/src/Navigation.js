import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";

export default function Navigation() {
  return (
    <header className="w-full h-auto border-0 bg-actualBlue-200 flex flex-row justify-center space-x-4">
      <div className="font-bold text-xl py-2 px-4">Emmaus Wellness</div>
      <nav className="flex flex-row justify-center space-x-2 text-lg font-semibold">
        <Link to="/"><button className="hover:bg-blue hover:text-white py-2 px-4">Home</button></Link>
        <Link to="/about"><button className="hover:bg-blue hover:text-white py-2 px-4">About</button></Link>
        <Link to="/events"><button className="hover:bg-blue hover:text-white py-2 px-4">Events</button></Link>
      </nav>
    </header>
  );
};
