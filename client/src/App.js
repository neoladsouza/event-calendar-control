import React, {useState} from "react";
import './App.css';

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  // const [postData, setPostData] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault(); // prevent webpage reloading

    const form = e.target; 
    const formData = new FormData(form);

    fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({formData})
    });
  }

  return (
    <>
      <form method="post" action={handleSubmit}>
        <label>
          Event Name: <input name="eventName" value={eventName} onChange={e => setEventName(e.target.value)}/>
        </label>
        <br/>
        <label>
          Event Type:
          <select name="selectedEventType" value={eventType} onChange={e => setEventType(e.target.value)}>
            <option value="course">Course</option>
            <option value="workshop">Workshop</option>
            <option value="retreat">Retreat</option>
          </select>
        </label>
        <br/>
        <label>
          Event Description: <textarea name="eventDesc" rows={4} cols={40}/>
        </label>
        <br/>
        <button type="reset">Reset form</button>
        <button type="submit">Submit form</button>
        <hr/>
      </form>
      {eventName !== '' && <p>Entered Event Name: {eventName}</p>}
      {eventType !== '' && <p>Entered Event Type: {eventType}</p>}
    </>
  );
}