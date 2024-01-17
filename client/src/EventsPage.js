import React from 'react';
import "./App.css";
import FormApp from "./FormApp.js";
import Footer from "./Footer.js";

export default function EventsPage({ credentials }) {
  // if credentials === null -> render calendar, and events table without modification buttons
  // else -> render the whole formApp
  return (
    <div>
      <FormApp credentials={credentials}/>
      <Footer/>
    </div>
  );
};
