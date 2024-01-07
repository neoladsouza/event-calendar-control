import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import './assets/main.css';
import { v4 as uuidv4 } from 'uuid';
import {addDays, subDays, eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth} from 'date-fns';
import clsx from 'clsx';

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
          <button type="submit" className="bg-transparent hover:bg-blue text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">Submit form</button>
        </form>
        <NewCalendar events={[
          {date: subDays(new Date(), 5), title: "make puski"},
          {date: subDays(new Date(), 8), title: "watch TODO"},
          {date: subDays(new Date(), 24), title: "read book"}
        ]}/>
      </main>
      <hr className="my-5 text-blue"/>
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


// new calendar component
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function NewCalendar({events}) {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  // makes an array of the dates in between the specified start and end dates
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // account for offset in dates (1st is a monday, not a sunday)
  const startingDayIndex = getDay(firstDayOfMonth); // returns index of the given day within its WEEK (so this would be 2, out of 0-6)
  const endingDayIndex = getDay(lastDayOfMonth);

  return (
    <div className="calendar-container container mx-auto p-4">
      <div className="mb-4">
        <h2 className="text-center">{format(currentDate, "MMMM yyyy")}</h2>
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-2">
        {
          WEEKDAYS.map((day) => {
            return <div key={day} className="font-bold text-center">{day}</div>
          })
        }

        {
          // render empty days to offset the dates
          Array.from({length: startingDayIndex}).map((_, index) => {
            return <div key={`empty-${index}`} className="border rounded-md p-2 text-center"></div>;
          })
        }

        {
        // array will not change across renders - so the key can be the index
          daysInMonth.map((day, index) => {
            return (
              <div key={index} className={clsx("border rounded-md p-2 text-center", {"bg-blue text-white" : isToday(day)})}>
                {format(day, "d")}
              </div>
            );
          })
        }

        {
          // render empty days to fill in the end of the calendar
          Array.from({length: (6 - endingDayIndex)}).map((_, index) => {
            return <div key={`empty-${index}`} className="border rounded-md p-2 text-center"></div>;
          })
        }
      </div>
    </div>
  );
}

const listOfDays = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, null, null, null];
// <Calendar list={allEvents}/>
function Calendar({list}) {
  const [calendarDays, setCalendarDays] = useState([]);

  function addEventToDay() {
    // adds events to all the days (sorta like a refresh button)
    console.log("puskat");
    if (list.length === 0) {
      console.log("nothing to add");
    }
  
    /*
    calendarDays.forEach(dayObject => {
      list.forEach(eventObject => {
        if (dayObject.day.localeCompare(eventObject.day) === 0) {
          dayObject.events.push(eventObject);
          console.log(dayObject);
        }
      });
    }); */
    calendarDays.forEach((dayObject) => {
      // loop through each event in allEvents
      for (let index = 0; index < list.length - 1; index++) {
        if (dayObject.events.length === 0) {
          dayObject.events.push(list[index]);
          console.log("event added because day had no events")
        } else {
          // let nonMatchingEventCounter = 0;
          let eventExists = false;
          // check if the event is already in the day's events by comparing their IDs 
          // need to loop through all events in dayObject
          for (let i = 0; i < dayObject.events.length; i++) {
            //  the event in allEvents      an event in dayObject
            if (list[index].id === dayObject.events.id) {
              // if the events match, that means the event already exists in the day -> so, list[index] should not be added to dayObject.events
              console.log("nothing happened because event already exists in the day");
              eventExists = true;
              break; // nothing happens
            }
          }
          // all events in the day do NOT match list[index]
          if (!eventExists) {
            dayObject.events.push(list[index]);
            console.log("event added normally");
          }
        }
      }
      console.log("did the loop");
    });
    console.log(calendarDays);
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
      <h3 className="font-bold">Your Events</h3>
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