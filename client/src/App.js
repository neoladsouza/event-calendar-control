import React, {useState} from "react";
import './App.css';

let events = [
  {name: 'cmsc131', type: 'course', description: 'stinky A+'},
  {name: 'math141', type: 'course', description: 'stinky B+'}
];

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  return (
    <>
      <form action={handleSubmit}>
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
      <ViewEvents events={events}/>
    </>
  );

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
    let eventObject = {
      name: eventName,
      type: eventType,
      description: eventDesc
    }
    // add that object to an array 
    events.push(eventObject);
  }

  function ViewEvents(props) {
    const events = props.events;
    return(
      <div>
        {
          events.map(event => (
            <div key={event.id}>
              <p>Your Event Name: {event.name}</p>
              <p>Your Event Type: {event.type}</p>
              <p>Your Event Description: {event.description}</p>
            </div>
            )
          )
        }
      </div>
    )
  }
}