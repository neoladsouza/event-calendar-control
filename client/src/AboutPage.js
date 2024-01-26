import React from 'react';
import "./App.css";
import Footer from "./Footer.js";
import chapel from "./emmaus-pictures/chapel.jpg";
import dining from "./emmaus-pictures/dining-room.jpg";
import lecture from "./emmaus-pictures/lecture-room.jpg";
import room from "./emmaus-pictures/bedroom1.jpg";

export default function AboutPage() {
  return (
    <div>
      <div className="title-container">
        <div className="title-banner">
          <h1>About Us</h1>
        </div>
      </div>

      <div className='about-grid'>
        <div className='shadow'><img src={chapel} alt="" /></div>
        <div className='centered-text'>
          <p>Emmaus Wellness Centre is a place to come and meet the risen Jesus and cast away all fears and anxieties.</p>
          <br />
          <p>There is a beautiful chapel with the theme of Emmaus' experience, Jesus breaking the bread with two disciples, depicted on the central wall.</p>
        </div>
        <div className='shadow'><img src={dining} alt="" /></div>
        <div className='shadow'><img src={room} alt="" /></div>
        <div className='centered-text'>
          <p>There are 20 self contained rooms for the participants to stay and participate in the programmes.
            Each self-contained room has a desk, bed, AC, fan, wardrobe, and a full bathroom. There are two lecture rooms; each can accommodate 50 persons. There is a dining room which can accommodate 30 persons.
            There is ample space for parking as well.</p>
        </div>
        <div className='shadow'><img src={lecture} alt="" /></div>
      </div>

      <div className='founder-grid'>
        <div className='headshot shadow'>Image</div>
        <div className="centered-text">
          <div>Fr. Dr. Henry Praveen D'Souza OCD is the director of Emmaus Wellness Centre. <br /> He holds a PhD in Counseling Psychology from De La Salle University, Manila, Philippines. </div>
          <div>Director Phone: 8007593531 </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

