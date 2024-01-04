import React, {useState} from "react";
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const possibleEventTypes = ['None', 'Service', 'Appointment', 'Course', 'Workshop', 'Retreat', 'Program'];

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setStartTime] = useState('');
  const [eventEndTime, setEndTime] = useState('');
  const [eventType, setEventType] = useState(possibleEventTypes[0]);
  const [eventDesc, setEventDesc] = useState('');
  const [allEvents, setAllEvents] = useState([]);

  function handleSubmit(e) {
    e.preventDefault(); // prevent webpage reloading
    /*
    const form = e.target; 
    const formData = new FormData(form);

    fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({formData})
    }); */

    // every time form is submitted -> create a new object with event name, type, and description properties
    const newEvent = { 
      name: eventName,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      type: eventType,
      description: eventDesc,
      id: eventName + uuidv4() // generate unique id for each event
    }

    // add that object to the array 
    setAllEvents([...allEvents, newEvent]);
  }
  function handleNameChange(e) {
    setEventName(e.target.value);
  }
  function handleDateChange(e) {
    setEventDate(e.target.value);
  }
  function handleStartTimeChange(e) {
    setStartTime(e.target.value);
  }
  function handleEndTimeChange(e) {
    setEndTime(e.target.value);
  }
  function handleTypeChange(e) {
    setEventType(e.target.value);
  }
  function handleDescChange(e) {
    setEventDesc(e.target.value);
  }

  function Events(props) {
    const events = props.events;
    return(
      <div>
        <h3>Your Events</h3>
        { 
          events.length === 0 ? 
            (<p>No events created</p>) :
            (events.map(event => (
              <ul key={event.id}>
                <li>Name: {event.name}</li>
                <li>Date: {event.date}</li>
                <li>Start Time: {event.startTime}</li>
                <li>End Time: {event.endTime}</li>
                <li>Type: {event.type}</li>
                <li>Description: {event.description}</li>
              </ul>
              ))
            )
        }
      </div>
    )
  }
  function Options(props) {
    const categories = props.categories;
    return(
      <>
        {
          categories.map((value, index) => (
            <option key={index} value={value} required>{value}</option>
          ))
        }
      </>
    );
  }

  // method="post" onSubmit={handleSubmit}
  // handle deleting events, accessing events to edit
  // handle proper input validation in handleSubmit() (call another function for it within handleSubmit)
  // parse date and time strings to have repeated events and/or visible durations (prime react library?)
    // parsing dates: splice date string to get each part -> create Date object + compare start date with end date
  return (
    <>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label>
              Event Name: <input type="text" name="eventName" value={eventName} onChange={handleNameChange} required/>
            </label>
          </li>
          <li>
            <label>
              Event Date: <input type="date" name="eventDate" value={eventDate} onChange={handleDateChange} required/>
            </label>
          </li>
          <li>
            <label>
              Event Start Time: <input type="time" name="eventStartTime" min="00:00" max="24:00" value={eventStartTime} onChange={handleStartTimeChange} required/>
            </label>
          </li>
          <li>
            <label>
              Event End Time: <input type="time" name="eventEndTime" value={eventEndTime} onChange={handleEndTimeChange} required/>
            </label>
          </li>
          <li>
            <label>
              Event Type:
              <select name="selectedEventType" value={eventType} onChange={handleTypeChange} required>
                <Options categories={possibleEventTypes}/>
              </select>
            </label>
          </li>
          <li>
            <label>
              Event Description: <textarea name="eventDesc" value={eventDesc} onChange={handleDescChange} required/>
            </label>
          </li>
        </ul>
        <button type="submit">Submit form</button>
      </form>
      <hr/>
      <Events events={allEvents}/>
    </>
  );
}