import React from 'react';
import "./App.css";

export default function HomePage() {
  // structure:
  // title with some background
  // two text boxes with images (styled either stack or grid)
  // upcoming events
  // footer
  return (
    <>
      <div className="title-container p-28">
        <div className="w-full p-5 mx-auto bg-white shadow-md  text-center italic">
          <h4>Emmaus Wellness Centre is a place to come and meet the risen Jesus and cast away all fears and anxieties. </h4>
          <h4>This is a unique and first of its kind centre in Goa.</h4>
        </div>
      </div>

      <div className="grid-container bg-actualBlue-200">
        <div className="grid-div">
          <div className='bg-white shadow-md'>Text 1</div>
          <div className='bg-blue text-white shadow-md rounded'>Image 1</div>
          <div className='bg-blue text-white shadow-md rounded'>Image 2</div>
          <div className='bg-white shadow-md'>Text 2</div>
        </div>
      </div>

      <div className="upcoming-container">
        <div className='w-auto mx-auto font-bold text-2xl'>Upcoming Events</div>
        <div className="event-div grid-div">
          <div className='bg-white shadow-md'>Event 1</div>
          <div className= 'bg-white shadow-md'>Event 2</div>
          <div className='bg-white shadow-md'>Event 3</div>
          <div className='bg-white shadow-md'>Event 4</div>
        </div>
      </div>


    </>
  );
};

