import React, {useState} from "react";
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const possibleEventTypes = ['Service', 'Appointment', 'Course', 'Workshop', 'Retreat', 'Program'];

export default function FormApp() {
  const [eventName, setEventName] = useState('');
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
                <li>Your Event Name: {event.name}</li>
                <li>Your Event Type: {event.type}</li>
                <li>Your Event Description: {event.description}</li>
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
            <option key={index} value={value.toLowerCase()}>{value}</option>
          ))
        }
      </>
    );
  }

  // method="post" onSubmit={handleSubmit}
  // idea ->  big switch statement for handling all input changes?
  // handle input validation in "handleSubmit"
  return (
    <>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label>
              Event Name: <input type="text" name="eventName" value={eventName} onChange={handleNameChange}/>
            </label>
          </li>
          <li>
            <label>
              Event Type:
              <select name="selectedEventType" value={eventType} onChange={handleTypeChange}>
                <Options categories={possibleEventTypes}/>
              </select>
            </label>
          </li>
          <li>
            <label>
              Event Description: <textarea name="eventDesc" value={eventDesc} onChange={handleDescChange}/>
            </label>
          </li>
        </ul>
        <button type="submit">Submit form</button>
      </form>
      <hr/>
      <button type="button">View Events</button>
      <hr/>
      <Events events={allEvents}/>
    </>
  );
}