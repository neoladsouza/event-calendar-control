import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage.js';
import AboutPage from './AboutPage.js';
import EventsPage from './EventsPage.js';
import Navigation from './Navigation.js';

export default function App() {
  // const [credentials, setCredentials] = useState(null);
  const credentials = "stinky";

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" exact element={<HomePage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/events" element={<EventsPage credentials={credentials}/>} />
        </Routes>
      </div>
    </Router>
  );
};