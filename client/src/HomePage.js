import React from 'react';
import "./App.css";
import { Link } from 'react-router-dom';
import front from "./emmaus-pictures/front-side.jpg";
import chapel from "./emmaus-pictures/chapel.jpg";
import Footer from "./Footer.js";

export default function HomePage() {
  // structure:
  // title with some background
  // two text boxes with images (styled either stack or grid)
  // upcoming events
  // footer
  return (
    <div>
      <div className="title-container">
        <div className="w-full p-5 mx-auto bg-white shadow-md font-semibold text-center text-xl italic">
          <h4>Emmaus Wellness Centre is a place to come and meet the risen Jesus and cast away all fears and anxieties. </h4>
          <h4>This is a unique and first of its kind centre in Goa.</h4>
        </div>
      </div>

      <div className="grid-container">
        <div className="grid-div">
          <div className="text-grid">
            <div className='bg-actualBlue-200 w-full mx-auto font-bold text-2xl text-center'>Who We Are</div>
            <div>
              <p>Emmaus is a place seven miles away from Jerusalem. Two disciples of Jesus, after witnessing the brutal murder of their master, were walking towards Emmaus full of fear and anxiety. Risen Jesus meets them on their way.</p>
              <br/>
              <p>Since sorrow had overpowered the disciples, they could not recognize him. It is only at the breaking of the bread at Emmaus their eyes were opened and they recognized Him. Their fear and anxiety vanishes.</p>
            </div>
            <Link to="/about"><button className="block bg-actualBlue-200 rounded-full py-2 px-4">About Us</button></Link>
          </div>
          <div className='shadow-md rounded'>
            <img src={front} alt="" />
          </div>
          <div className='bg-blue text-white shadow-md rounded'>
            <img src={chapel} alt="" />
          </div>
          <div className='text-grid'>
            <div className='bg-actualBlue-200 w-full mx-auto font-bold text-2xl text-center'>What We Do</div>
            <div>
              <p>Many programs, ranging from courses to retreats, are offered at Emmaus. We are open for week-long self-directed or guided retreats for religious as well as lay people throughout the year.
We are also open for private workshops, seminars and meetings</p>
            </div>
            <div className='w-auto mx-auto font-bold text-2xl text-center'>Our Programs</div>
            <div>
              <ul>
                <li><p>Counseling Appointments</p></li>
                <li><p>Psychological Assessments</p></li>
                <li><p>Guided Retreats</p></li>
                <li><p>Counseling Courses</p></li>
                <li><p>Weekday/Weekend Workshops</p></li>
              </ul>
            </div>
            <Link to="/events"><button className="block bg-actualBlue-200 rounded-full py-2 px-4">Our Events and Programs</button></Link>
          </div>
        </div>
      </div>

      <div className="upcoming-container">
        <div className='w-auto mx-auto font-bold text-2xl'>Upcoming Events</div>
        <div className="event-div grid-div">
          <div className='bg-white shadow-md'>Event 1</div>
          <div className='bg-white shadow-md'>Event 2</div>
          <div className='bg-white shadow-md'>Event 3</div>
          <div className='bg-white shadow-md'>Event 4</div>
        </div>
        <Link to="/events"><button className='w-auto mx-auto bg-blue text-white rounded-full py-2 px-4'>Our Calendar</button></Link>
      </div>

      <Footer/>

    </div>
  );
};

