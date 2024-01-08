import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth } from 'date-fns';
import clsx from 'clsx';

// CURRENT GOAL ->  
// UPCOMING GOALS -> sort events (date), filter events (event type)
// LATER GOALS -> proper input validation, provide clarity about edit/save/submit form buttons (refactor code)

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
      if (i < 10) { i = "0" + i }
      return i;
    }

    const date = new Date(this);
    const hours = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    return hours + ":" + minutes;
  }
}

const possibleEventTypes = ['None', 'Service', 'Appointment', 'Course', 'Workshop', 'Retreat', 'Program'];
// const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventStart, setStart] = useState(new CustomDate());
  const [eventEnd, setEnd] = useState(new CustomDate());
  const [eventType, setEventType] = useState(possibleEventTypes[0]);
  const [eventDesc, setEventDesc] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [currentEventID, setCurrentEventID] = useState('');
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);

  function handleSubmit(e) {
    e.preventDefault(); // prevent webpage reloading
    let newEvent;

    // checking if event exists in array
    const noEventMatchesCurrentID = allEvents.every((event) => (event.id !== currentEventID))
    if (noEventMatchesCurrentID) { // create a new event if no events in the array match the current ID
      console.log("creating a new event...");
      newEvent = {
        name: eventName,
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
      setAllEvents([...allEvents, newEvent]); // state updates are Asynchronous - need to place reliant code in useEffect  
    } else { // if event does exist, reassign values of that specific event object
      console.log("reassigning an existing event...");
      allEvents.some((event) => {
        if (event.id === currentEventID) {
          event.name = eventName;
          event.start = eventStart;
          event.end = eventEnd;
          event.startDate = eventStart.toLocaleDateString().split(',')[0];
          event.endDate = eventEnd.toLocaleDateString().split(',')[0];
          event.startTime = eventStart.getTimeToString();
          event.endTime = eventEnd.getTimeToString();
          event.type = eventType;
          event.description = eventDesc;
          setAllEvents([...allEvents]);
          return true;
        } else {
          return false;
        }
      });
    }
  }

  function handleEditClick(eventObject) {
    // populate form fields with event info
    setEventName(eventObject.name);
    setStart(eventObject.start);
    setEnd(eventObject.end);
    setEventType(eventObject.type);
    setEventDesc(eventObject.description);
    setCurrentEventID(eventObject.id);
    console.log(eventObject.name + " is clicked");
    // when user submits form -> that specific event should be changed (use ID)
  }

  function handleSaveClick() {
    console.log("save");
    setCurrentEventID('');
  }

  function handleDeleteClick(eventObject) {
    // safely "delete" event by setting the state to a new array where that event is filtered out
    setAllEvents(allEvents.filter((event) => event.id !== eventObject.id));
  }

  // useEffects for handling POST and GET requests -> putting on hold to implement calendar
  useEffect(() => {
    // code that relies on the updated state
    setEventsForSelectedDay(allEvents);
    setSelectedDay(null);
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
      // const [isPosted, setIsPosted] = useState(false);
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

  return (
    <div className="font-sans mx-auto my-10 w-4/5">
      <main className="w-full my-0 mx-auto h-auto flex flex-row justify-evenly">
        <form onSubmit={handleSubmit} className= "text-center bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mx-0 w-1/4 border border-blue">
            <div className="mt-4">
              <label htmlFor="eventName" className="block text-left text-m font-bold mb-1">Event Name:</label>
              <input id="eventName" type="text" name="eventName" value={eventName} onChange={handleNameChange} required
                className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black" />
            </div>
            <div className="mt-4">
              <label htmlFor="eventStart" className="block text-left text-m font-bold mb-1">Event Start:</label>
              <input id="eventStart" type="datetime-local" name="eventStart" min="2024-01-01T00:00" max="2024-01-31T23:59" value={eventStart.toISOStringWithOffset().slice(0, 16)} onChange={handleStartChange} required
                className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black hover:cursor-pointer" />
            </div>
            <div className="mt-4">
              <label htmlFor="eventEnd" className="block text-left text-m font-bold mb-1">Event End:</label>
              <input id="eventEnd" type="datetime-local" name="eventEnd" min="2024-01-01T00:00" max="2024-01-31T23:59" value={eventEnd.toISOStringWithOffset().slice(0, 16)} onChange={handleEndChange} required
                className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black hover:cursor-pointer" />
            </div>
            <div className="mt-4">
              <label htmlFor="selectedEventType" className="block text-left text-m font-bold mb-1">Event Type:</label>
              <select id="selectedEventType" name="selectedEventType" value={eventType} onChange={handleTypeChange} required
                className="mx-auto w-full bg-white border border-black px-3 py-2 rounded shadow leading-tight focus:border-black hover:cursor-pointer">
                <Options categories={possibleEventTypes}/>
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="eventDesc" className="block text-left text-m font-bold mb-1">Event Description: </label>
              <textarea id="eventDesc" name="eventDesc" value={eventDesc} onChange={handleDescChange} required className="w-full h-full py-2 px-3 rounded border border-blue shadow align-top focus:border-black" />
            </div>
            <button type="submit" className="mt-5 bg-transparent hover:bg-gray-200 font-semibold py-2 px-4 border border-blue hover:border-transparent rounded text-center">Submit form</button>
        </form>
        <NewCalendar events={allEvents} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} selectedDay={selectedDay} setSelectedDay={setSelectedDay} eventsForSelectedDay={eventsForSelectedDay} setEventsForSelectedDay={setEventsForSelectedDay} handleDeleteClick={handleDeleteClick}/>
      </main>
    </div>
  );
}

function Options({ categories }) {
  return (
    <>
      {
        categories.map((value, index) => (
          <option key={index} value={value} required>{value}</option>
        ))
      }
    </>
  );
}

function NewCalendar({ events, handleEditClick, handleSaveClick, selectedDay, setSelectedDay, eventsForSelectedDay, setEventsForSelectedDay, handleDeleteClick}) {
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
  const eventsByDate = useMemo(() => {
    return (
      // returns an object where each key-value pair is a date and an array of events with the same date
      events.reduce((acc, event) => { // iterates over each event and accumulate them into an object of arrays
        let startDateObject = event.start;
        let endDateObject = event.end;
        const daysInterval = eachDayOfInterval({start: startDateObject, end: endDateObject}); // an array of Date objects in between start, end
        let dateKeys = []; // array of dateKeys
        daysInterval.forEach((day) => {
          dateKeys.push(format(day.toLocaleDateString().split(',')[0], "yyyy-MM-dd")); // formatted date is used as the key for grouping events
        })

        dateKeys.forEach((dateKey) => {
          if (!acc[dateKey]) { // the date key doesn't exist in the accumulator object
            acc[dateKey] = []; // it creates an empty array for that date key
          }
          acc[dateKey].push(event); // pushes the current event into the array corresponding to its date key
        });
        return acc;
      }, {})
    )
  }, [events]);

  function handleDayClick(someDay) {
    setSelectedDay(someDay.toLocaleDateString());
    const someDateKey = format(someDay, "yyyy-MM-dd")
    setEventsForSelectedDay(eventsByDate[someDateKey] || []);
  }

  function handleCloseClick() {
    setSelectedDay(null);
    setEventsForSelectedDay(events); // allEvents
  }

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
          Array.from({ length: startingDayIndex }).map((_, index) => {
            return (<div key={`empty-${index}`} className="border rounded-md p-2 text-center"></div>);
          })
        }

        {
          daysInMonth.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd"); // making a key to access the event(s) by
            const todaysEvents = eventsByDate[dateKey] || [];
            return (
              <Day key={dateKey + uuidv4()} index={index} day={day} dateKey={dateKey} todaysEvents={todaysEvents} selectedDay={selectedDay} onDayClick={handleDayClick} />
            );
          })
        }

        {
          // render empty days to fill in the end of the calendar
          Array.from({ length: (6 - endingDayIndex) }).map((_, index) => {
            return (<div key={`empty-${index}`} className="border rounded-md p-2 text-center"></div>);
          })
        }
      </div>
      <hr className="w-full h-1 mt-5 bg-blue border-0 rounded" />
      <EventShowcase listOfEvents={eventsForSelectedDay} selectedDay={selectedDay} onClose={handleCloseClick} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick}/>
    </div>
  );
}

function Day({ index, day, dateKey, todaysEvents, selectedDay, onDayClick }) {
  function handleClick() {
    onDayClick(day); // sets selectedDay to day (Date object)
    console.log(day.toLocaleDateString() + " clicked");
  }

  return (
    <div key={index + day + dateKey} onClick={handleClick} className={clsx("border rounded-md p-2 text-center hover:cursor-pointer", { "bg-gray-200 text-gray-900": isToday(day), "border-blue border-2": day.toLocaleDateString() === selectedDay })}>
      <p className="mb-2">{format(day, "d")}</p>
      {todaysEvents.map((event) => {
        return (
          <div key={event.name + dateKey + uuidv4()} className="bg-otherBlue rounded-md text-white px-1 mb-2">
            <div className="font-semibold mb-1">
              {event.name}
            </div>
            {event.type}
          </div>);
      })}
    </div>
  )
}

function EventShowcase({ selectedDay, listOfEvents, onClose, handleEditClick, handleSaveClick, handleDeleteClick }) {
  const list = Array.from(listOfEvents);

  return (
    <>
      <div className="w-full h-auto m-0 flex flex-row justify-between">
        {
          (selectedDay === null) ? (<h3 className="font-bold w-auto text-xl my-4 text-center">Your Events</h3>) : (<h3 className="font-bold w-auto text-xl my-4 text-center">Your Events for {selectedDay}</h3>)
        }
        {
          (selectedDay === null) ? (<button onClick={onClose} className="cursor-not-allowed opacity-50 my-3 h-auto w-auto bg-transparent text-center font-semibold py-2 px-4 border border-blue rounded">Close</button>) 
          : <button onClick={onClose} className="my-3 h-auto w-auto bg-transparent text-center hover:bg-gray-200 -700 font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">Close</button>
        }
      </div>
      <div className="flex flex-row flex-wrap justify-evenly">
        {
          list.length === 0 ?
            (<p>No events created</p>) :
            (list.map(event => (
              <Event key={event.id} eventObject={event} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick}/>
            ))
            )
        }
      </div>
    </>
  );
}

function Event({ eventObject, handleEditClick, handleSaveClick, handleDeleteClick }) {
  const [isEditing, setIsEditing] = useState(false);

  function handleEdit() {
    handleEditClick(eventObject);
    setIsEditing(true);
  }

  function handleSave() {
    handleSaveClick();
    setIsEditing(false);
  }

  function handleDelete() {
    handleDeleteClick(eventObject);
  }

  return (
    <div className="block border bg-gray-200 my-5 mx-5">
      <div className="flex flex-row justify-between px-2 h-auto">
        <button onClick={handleEdit} className="mt-3 h-auto w-auto bg-transparent text-center hover:bg-white font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">Edit</button>
        {
          (isEditing === true) ? (<div className="text-lg font-semibold mt-4">Editing...</div>) : (<div className="text-lg font-semibold mt-4">Saved!</div>)
        }
        <button onClick={handleDelete}className="mt-3 h-auto w-auto bg-transparent text-center hover:bg-white -700 font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">Delete</button>
        <button onClick={handleSave}className="mt-3 h-auto w-auto bg-transparent text-center hover:bg-white -700 font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">Save</button>
      </div>
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