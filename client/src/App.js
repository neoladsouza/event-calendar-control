import React, {useState, useEffect} from "react";
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
  /* const [isPosted, setIsPosted] = useState(false);
  const [data, setData] = useState(null); */

  function handleSubmit(e) {
    e.preventDefault(); // prevent webpage reloading

    // every time form is submitted -> create a new object with event name, type, and description properties
    // 0123456789
    // yyyy-mm-dd
    const newEvent = { 
      name: eventName,
      date: eventDate,
      month: eventDate.substring(5, 7),
      day: eventDate.substring(8, 9).localeCompare("0") === 0 ? eventDate.substring(9, 10) : eventDate.substring(8, eventDate.length),
      startTime: eventStartTime,
      endTime: eventEndTime,
      type: eventType,
      description: eventDesc,
      id: eventName + uuidv4() // generate unique id for each event
    }

    // state updates are Asynchronous - need to place reliant code in useEffect
    setAllEvents([...allEvents, newEvent]);
  }

  // useEffects for handling POST and GET requests -> putting on hold to implement calendar
  useEffect(() => {
    // code that relies on the updated state
    console.log(allEvents);
    /*
    // function definition
      try {
        const response = await fetch("/events", {
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify(allEvents),
        });
  
        if (response.ok) {
          console.log("data sent successfully!");
          const responseData = await response.json();
          console.log('Server response:', responseData);
          setIsPosted(true);
        } else {
          console.log("failed to send data :(");
          setIsPosted(false);
        }
      } catch (error) {
        console.log("error sending data: ", error);
        setIsPosted(false);
      }
    }
    
    postEventsJSON(); */
  }, [allEvents]); //  this code will log allEvents to the console whenever any of these allEvents changes

  /*
  useEffect(() => {
    console.log("Is Posted? :", isPosted);

    async function fetchEventsJSON() {
      try {
        const response = await fetch("/events");
  
        if (response.ok) {
          console.log("data fetched successfully!");
          const fetchedData = await response.json();
          setData(fetchedData);
          console.log('Server response:', fetchedData);
        } else {
          console.error("failed to fetch data :(");
        }
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    }

    if (isPosted === true) {
      fetchEventsJSON();
    } else {
      console.log("did not fetch because isPosted is false");
    }
  }, [isPosted]);
  */
  
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

  // 1. make Calendar
  // handle deleting events, accessing events to edit
  // handle proper input validation in handleSubmit() (call another function for it within handleSubmit)
  // parse date and time strings to have repeated events and/or visible durations (prime react library?)
    // parsing dates: splice date string to get each part -> create Date object + compare start date with end date
  // method="POST"
  return (
    <>
    <main>
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
        <Calendar list={allEvents}/>
      </main>
      <hr/>
      <Events dataList={allEvents}/>
    </>
  );
}

function Options({categories}) {
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

// making the calendar -> try a 1-month calendar, say January 2024 - starts jan 1 on monday, jan 31 on wednesday - need to fill in other days
// split event's date into year, month, day -> if day and month match the calendar, put the event in that day
// each day -> {year, month, day, events}

const listOfDays = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null];

function Calendar({list}) {
  const [calendarDays, setCalendarDays] = useState([]);

  function addEventToDay() {
    // if the same event already exists in the day, don't add it 
    // once the correct day is found, add the event and stop
    // ideally -> loop through all the days and all the events, 
    // what's actually happening -> the correct day is being logged to the console 

    console.log("puskat");
    console.log(calendarDays);
    if (list.length === 0) {
      console.log("nothing to add");
    }
  
    calendarDays.forEach(dayObject => {
      list.forEach(eventObject => {
        if (dayObject.day.localeCompare(eventObject.day) === 0) {
          dayObject.events.push(eventObject);
          console.log(dayObject);
        }
      });
    });
  }

  if (calendarDays.length === 0) {
    for (let index = 0; index < listOfDays.length; index++) {
      setCalendarDays(prevCalendarDays => [...prevCalendarDays, createDayObject(listOfDays[index])]);
    }
  }

  const createDayObject = (number) => {
    const year = "2024";
    const month = "01";
    const day = (number === null) ? ("00") : number.toString();

    return {
      id: uuidv4(),
      year: year,
      month: month,
      day: day,
      events: []
    };
  };

  const weeks = Array.from({length: 5}, (_, index) => {
    const startDay = index * 7;
    return listOfDays.slice(startDay, startDay + 7);
  });

  return (
    <div className="calendar-container">
      <h3>Your Calendar</h3>
      <button type="button" onClick={addEventToDay}>Add Event</button>
      <table>
        <caption><h4>January 2024</h4></caption>
        <thead>
          <tr>
            <td>Sunday</td>
            <td>Monday</td>
            <td>Tuesday</td>
            <td>Wednesday</td>
            <td>Thursday</td>
            <td>Friday</td>
            <td>Saturday</td>
          </tr>
        </thead>
        <tbody>
          {
            // every 7 days, make a new row
            weeks.map((week, weekIndex) => (
              <tr key={weekIndex + uuidv4()}>
                {
                  week.map((dayNumber) => (
                    <Day key={dayNumber + uuidv4()} numberOfDay={dayNumber}/>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

function Day({numberOfDay}) {
  return (
    <td className="day">
      {numberOfDay} 
      {/*
        (newDayObject.events.length === 0) ? 
          (<p>No events</p>) :
          (<p>{newDayObject.events}</p>) */
      }
      
    </td>
  );
}

function Events({dataList}) {
  const list = Array.from(dataList);
  return(
    <div className="events-container">
      <h3>Your Events</h3>
      { 
        list.length === 0 ? 
          (<p>No events created</p>) :
          (list.map(event => (
            // need to destructure props by spreading the properties of each object as separate props 
            <Event key={event.id} id={event.id} name={event.name} date={event.date} startTime={event.startTime} endTime={event.endTime} type={event.type} description={event.description} {...event}/>
            ))
          )
      }
    </div>
  );
  /*
  if (isPosted === true) {
    return (
      <>
        <h3>Your Events</h3>
        <pre>{data}</pre>
      </>
    );
  } */
}

function Event({id, name, date, startTime, endTime, type, description}) {
  return (
    <div>
       <ul key={id}>
          <li>Name: {name}</li>
          <li>Date: {date}</li>
          <li>Start Time: {startTime}</li>
          <li>End Time: {endTime}</li>
          <li>Type: {type}</li>
          <li>Description: {description}</li>
        </ul>
    </div>
  );
}