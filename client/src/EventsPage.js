import React from 'react';
import "./App.css";

export default function EventsPage({ credentials }) {
  // if credentials === null -> render calendar, and events table without modification buttons
  // else -> render the whole formApp
  return (
    <div>
      <h2>Events Page</h2>
      <p>Explore our upcoming events.</p>
    </div>
  );
};
