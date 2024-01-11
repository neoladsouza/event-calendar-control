import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";

export default function Navigation() {
  return (
    <nav className="w-full h-auto border-0 bg-actualBlue-200">
      <div className="flex flex-row justify-center space-x-2 text-lg font-semibold">
        <div className="font-bold text-xl py-2 px-4">Emmaus Wellness</div>
        <button className="hover:bg-blue hover:text-white py-2 px-4"><Link to="/">Home</Link></button>
        <button className="hover:bg-blue hover:text-white py-2 px-4"> <Link to="/about">About</Link></button>
        <button className="hover:bg-blue hover:text-white py-2 px-4"><Link to="/events">Events</Link></button>
      </div>
    </nav>
  );
};
