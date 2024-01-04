import React from "react";
import './App.css';

export default function FormApp() {
  function handleSubmit(e) {
    e.preventDefault(); // prevent webpage reloading

    const form = e.target; 
    const formData = new FormData(form);

    fetch('/api', {method : form.method, body : formData});
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Event Name: <input name="eventName"/>
        </label>
        <hr/>
        <p>
          Event Type:
          <label>
            <input type="radio" name="eventType" value="course"/> Course
          </label>
          <label>
            <input type="radio" name="eventType" value="workshop"/> Workshop
          </label>
          <label>
            <input type="radio" name="eventType" value="retreat"/> Retreat
          </label>
        </p>
        <hr/>
        <label>
          Event Description: <textarea name="eventDesc"/>
        </label>
        <hr/>
        <button type="reset">Reset form</button>
        <button type="submit">Submit form</button>
      </form>
    </>
  );
}