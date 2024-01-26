import React from 'react';
import "./App.css";
import { Link } from 'react-router-dom';
import front from "./emmaus-pictures/front-side.jpg";
import chapel from "./emmaus-pictures/chapel.jpg";
import Footer from "./Footer.js";

export default function HomePage() {
  return (
    <div>
      <div className="title-container">
        <div className="title-banner">
          <h1>Emmaus Wellness Centre is a place to come and meet the risen Jesus and cast away all fears and anxieties. </h1>
          <h2 className="italic subtitle">This is a unique and first of its kind centre in Goa.</h2>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-div">
          <div className="text-section">
            <div className='home-subheading'><h3>Who We Are</h3></div>
            <div>
              <p>Emmaus is a place seven miles away from Jerusalem. Two disciples of Jesus, after witnessing the brutal murder of their master, were walking towards Emmaus full of fear and anxiety. Risen Jesus meets them on their way.</p>
              <br/>
              <p>Since sorrow had overpowered the disciples, they could not recognize him. It is only at the breaking of the bread at Emmaus their eyes were opened and they recognized Him. Their fear and anxiety vanishes.</p>
            </div>
            <Link to="/about"><button className="linked-button">About Us</button></Link>
          </div>
          <div className='image shadow'>
            <img src={front} alt="" />
          </div>
          <div className='image shadow'>
            <img src={chapel} alt="" />
          </div>
          <div className='text-section'>
            <div className='home-subheading'><h3>What We Do</h3></div>
            <div>
              <p>Many programs, ranging from courses to retreats, are offered at Emmaus. We are open for week-long self-directed or guided retreats for religious as well as lay people throughout the year.
We are also open for private workshops, seminars and meetings</p>
            </div>
            <div className='home-subheading'><h3>Our Programs</h3></div>
            <div>
              <ul>
                <li><p>Counseling Appointments</p></li>
                <li><p>Psychological Assessments</p></li>
                <li><p>Guided Retreats</p></li>
                <li><p>Counseling Courses</p></li>
                <li><p>Weekday/Weekend Workshops</p></li>
              </ul>
            </div>
            <Link to="/events"><button className="linked-button">Our Events and Programs</button></Link>
          </div>
        </div>
      </div>

      <div className="upcoming-container">
        <div className='home-subheading upcoming-heading'><h2>Upcoming Events</h2></div>
        <div className="event-div grid-div">
          <div className=''>Event 1</div>
          <div className=''>Event 2</div>
          <div className=''>Event 3</div>
          <div className=''>Event 4</div>
        </div>
        <Link to="/events"><button className='linked-button'>Our Calendar</button></Link>
      </div>

      <Footer/>

    </div>
  );
};

