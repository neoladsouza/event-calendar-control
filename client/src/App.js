import React, {useState} from "react";
import './App.css';

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const events = [];

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
    const eventObject = {
      "name": eventName,
      "type": eventType,
      "description": eventDesc
    }
    // add that object to an array 
    events.push(eventObject);
  }

  // every time "view events" is clicked -> map each object in the array to a <Event/> component
  return (
    <>
      <form method="post" action={handleSubmit}>
        <ul>
          <li>
            <label>
              Event Name: <input type="text" name="eventName" value={eventName} onChange={e => setEventName(e.target.value)}/>
            </label>
          </li>
          <li>
            <label>
              Event Type:
              <select name="selectedEventType" value={eventType} onChange={e => setEventType(e.target.value)}>
                <option value="course">Course</option>
                <option value="workshop">Workshop</option>
                <option value="retreat">Retreat</option>
              </select>
            </label>
          </li>
          <li>
            <label>
              Event Description: <textarea name="eventDesc" rows={4} cols={40} value={eventDesc} onChange={e => setEventDesc(e.target.value)}/>
            </label>
          </li>
        </ul>
        <button type="submit">Submit form</button>
      </form>
      <hr/>
      <button type="button">View Events</button>
      {eventName !== '' && <p>Entered Event Name: {eventName}</p>}
      {eventType !== '' && <p>Entered Event Type: {eventType}</p>}
      {eventDesc !== '' && <p>Entered Event Description: {eventDesc}</p>}
    </>
  );
}