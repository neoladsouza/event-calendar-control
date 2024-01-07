import React, {useState, useEffect, useMemo} from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import {eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth} from 'date-fns';
import clsx from 'clsx';

// CURRENT GOAL -> reformat all events to use Date objects 
// LET EVENTS ONLY BE ONE DAY
class CustomDate extends Date {
  toISOStringWithOffset() {
    const offset = 5; // EST is 5 hours behind toISOString() 

    // Adjust the time by subtracting 5 hours
    const adjustedDate = new Date(this);
    adjustedDate.setHours(adjustedDate.getHours() - offset);
    
    // Use the standard toISOString method on the adjusted date
    return adjustedDate.toISOString().slice(0, 16);
  }

  getTimeToString() {
    function addZero(i) {
      if (i < 10) {i = "0" + i}
      return i;
    }

    const date = new Date(this);
    const hours = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    return hours + ":" + minutes;
  }
}


const possibleEventTypes = ['None', 'Service', 'Appointment', 'Course', 'Workshop', 'Retreat', 'Program'];
const sampleEvents = [{date: new CustomDate("2024-01-05"), title: "make puski"}, {date: new CustomDate("2024-01-08"), title: "watch TODO"}, {date: new CustomDate("2024-01-24"), title: "read book"}];
// const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  // const [eventDate, setEventDate] = useState(new Date()); 
  const [eventStart, setStart] = useState(new CustomDate());
  const [eventEnd, setEnd] = useState(new CustomDate());
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
    // every event has a ... startDate, endDate, startTime, endTime
    const newEvent = { 
      name: eventName,
      // date: eventStart.toLocaleDateString(), // 1/7/2024, 3:01:00 PM
      start: eventStart, // CustomDate object
      end: eventEnd, // CustomDate object
      startDate: eventStart.toLocaleDateString().split(',')[0],
      endDate: eventEnd.toLocaleDateString().split(',')[0],
      startTime: eventStart.getTimeToString(),
      endTime: eventEnd.getTimeToString(),
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
  function handleStartChange(e) {
    let startString = e.target.value; // format is 2017-06-01T08:30
    // let startDate = startString.split('T')[0]; // 2017-06-01 (ISO 8601 format)
    // let startTime = startString.split('T')[1]; // 08:30
    let date = new CustomDate(startString.slice(0, 16));
    setStart(date);
    /*
    // regular expression - to check format of inputted date string
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/; 
    if (regex.test(startString)) {
      let date = new Date(startString);
      setStart(date);
      // console.log(date, date.toLocaleString());
      // console.log(eventStart.toISOString()); // 5 hours ahead
    } else {
      console.log("invalid date entered");
    }*/
  }
  function handleEndChange(e) {
    let endString = e.target.value;
    let date = new CustomDate(endString.slice(0, 16));
    setEnd(date);
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
    <div className="font-sans mx-auto my-10 w-4/5">
      <main className="w-full my-0 mx-auto h-auto flex flex-row justify-evenly">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mx-0 w-1/4 border border-blue">
          <ul className="p-0 mb-1em list-none">
            <li className="mt-4">
              <label htmlFor="eventName" className="block  text-m font-bold mb-1">Event Name:</label>
              <input id="eventName" type="text" name="eventName" value={eventName} onChange={handleNameChange} required
              className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black"/>
            </li>
            <li className="mt-4">
              <label htmlFor="eventStart" className="block  text-m font-bold mb-1">Event Start Time:</label>
              <input id="eventStart" type="datetime-local" name="eventStart" min="2024-01-01T00:00" max="2024-01-31T23:59" value={eventStart.toISOStringWithOffset().slice(0,16)} onChange={handleStartChange} required
              className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black"/>
            </li>
            <li className="mt-4">
              <label htmlFor="eventEnd" className="block  text-m font-bold mb-1">Event End Time:</label>
              <input id="eventEnd" type="datetime-local" name="eventEnd" min="2024-01-01T00:00" max="2024-01-31T23:59" value={eventEnd.toISOStringWithOffset().slice(0,16)} onChange={handleEndChange} required
              className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black"/>
            </li>
            <li className="mt-4">
              <label htmlFor="selectedEventType" className="block  text-m font-bold mb-1">Event Type:</label>
              <select id="selectedEventType" name="selectedEventType" value={eventType} onChange={handleTypeChange} required
              className="mx-auto w-full bg-white border border-black px-3 py-2 rounded shadow leading-tight focus:border-black">
                <Options categories={possibleEventTypes}/>
              </select>
            </li>
            <li className="mt-4">
              <label htmlFor="eventDesc" className="block  text-m font-bold mb-1">Event Description: </label>
              <textarea id="eventDesc" name="eventDesc" value={eventDesc} onChange={handleDescChange} required className="w-full h-full py-2 px-3 rounded border border-blue shadow align-top focus:border-black"/>
            </li>
            <button type="submit" className="mt-5 bg-transparent hover:bg-gray-200 -700 font-semibold py-2 px-4 border border-blue hover:border-transparent rounded text-center">Submit form</button>
          </ul>
        </form>
        <NewCalendar events={sampleEvents}/>
      </main>
      <hr className="w-full h-1 mt-5 bg-blue border-0 rounded"/>
      <Events dataList={allEvents}/>
    </div>
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

function NewCalendar({events}) {
  const currentDate = new CustomDate();
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

  // useMemo -> don't want to perform all this code unless absolutely necessary
  // take all of the events and create an object where each event can be accessed by a key, which is their date
  const eventsByDate = useMemo(() => {
    return (
      events.reduce((acc, event) => {
        const dateKey = format(event.date, "yyyy-MM-dd");
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      }, {})
    )
  }, [events]);

  return (
    <div className="mx-0 w-auto h-auto border border-blue bg-white shadow-md rounded-xl p-5">
        <h2 className="text-center mb-1 font-bold text-lg">{format(currentDate, "MMMM yyyy")}</h2>
      <div className="grid grid-cols-7 gap-2">
        {
          WEEKDAYS.map((day) => {
            return (<div key={day} className="font-bold text-center">{day}</div>);
          })
        }

        {
          // render empty days to offset the dates
          Array.from({length: startingDayIndex}).map((_, index) => {
            return (<div key={`empty-${index}`} className="border rounded-md p-2 text-center"></div>);
          })
        }

        {
        // array will not change across renders - so the key can be the index
          daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd"); // making a key to access the event(s) by
            const todaysEvents = eventsByDate[dateKey] || [];
            return (
              <div key={index} className={clsx("border rounded-md p-2 text-center", {"bg-gray-200 text-gray-900" : isToday(day)})}>
                <p className="mb-2">{format(day, "d")}</p>
                {todaysEvents.map((event) => {
                  return (<div key={event.title} className="bg-green-200 rounded-md text-gray-900 p-0.5">{event.title}</div>);
                })}
              </div>
            );
          })
        }

        {
          // render empty days to fill in the end of the calendar
          Array.from({length: (6 - endingDayIndex)}).map((_, index) => {
            return (<div key={`empty-${index}`} className="border rounded-md p-2 text-center"></div>);
          })
        }
      </div>
    </div>
  );
}

function Events({dataList}) {
  const list = Array.from(dataList);
  return(
    <>
      <h3 className="font-bold w-auto text-lg mx-auto my-3 text-center ">Your Events</h3>
      <div className="flex flex-row flex-wrap justify-evenly">
        { 
          list.length === 0 ? 
            (<p>No events created</p>) :
            (list.map(event => (
              // need to destructure props by spreading the properties of each object as separate props 
              <Event key={event.id} eventObject={event}/>
              ))
            )
        }
      </div>
    </>
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

function Event({eventObject}) {


  return (
    <div className="block border bg-gray-200 my-5 mx-5">
       <ul key={eventObject.id} className="list-disc list-inside p-5">
          <li>Name: {eventObject.name}</li>
          {
          (eventObject.startDate === eventObject.endDate) ?
              (<li>Date: {eventObject.startDate}</li>) : (<li>Dates: {eventObject.startDate + " to " + eventObject.endDate}</li>) 
          }

          {
          (eventObject.startTime === eventObject.endTime) ?
              (<li>Time: {eventObject.startTime}</li>) : (<li>Times: {eventObject.startTime + " to " + eventObject.endTime}</li>) 
          }
          <li>Type: {eventObject.type}</li>
          <li>Description: {eventObject.description}</li>
        </ul>
    </div>
  );
}

// previous calendar, day components
/*
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
  
    // bad version
    calendarDays.forEach(dayObject => {
      list.forEach(eventObject => {
        if (dayObject.day.localeCompare(eventObject.day) === 0) {
          dayObject.events.push(eventObject);
          console.log(dayObject);
        }
      });
    }); 

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
      {
        (newDayObject.events.length === 0) ? 
          (<p>No events</p>) :
          (<p>{newDayObject.events}</p>)
      }
    </td>
  );
} */