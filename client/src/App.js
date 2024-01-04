import React, {useState} from "react";
import './App.css';
import { v4 as uuidv4 } from 'uuid';

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
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

  function ViewEvents(props) {
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

  // method="post" onSubmit={handleSubmit}
  return (
    <>
      <form onSubmit={handleSubmit}>
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
      {eventName !== '' && <p>Entered Event Name: {eventName}</p>}
      {eventType !== '' && <p>Entered Event Type: {eventType}</p>}
      {eventDesc !== '' && <p>Entered Event Description: {eventDesc}</p>}
      <hr/>
      <button type="button">View Events</button>
      <hr/>
      <ViewEvents events={allEvents}/>
    </>
  );
}