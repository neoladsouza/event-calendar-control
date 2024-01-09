import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth, isBefore, isEqual, isAfter, sub, add } from 'date-fns';
import clsx from 'clsx';

// CURRENT GOAL -> fix table rendering, text overflows with no wrapping
// LATER GOALS -> proper input validation 

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

  compareDates(date2) {
    if (isBefore(this, date2)) {
      return -1;
    } else if (isEqual(this, date2)) {
      return 0;
    } else if (isAfter(this, date2)) {
      return 1;
    }
  }
}

const allEventTypes = ['None', 'Service', 'Appointment', 'Course', 'Workshop', 'Retreat', 'Program'];
// const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventStart, setStart] = useState(new CustomDate());
  const [eventEnd, setEnd] = useState(new CustomDate());
  const [eventType, setEventType] = useState(allEventTypes[0]);
  const [eventDesc, setEventDesc] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [currentEventID, setCurrentEventID] = useState('');

  const [selectedDay, setSelectedDay] = useState(null);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);

  function handleSubmit(e) {
    e.preventDefault(); // prevent webpage reloading
    let newEvent;

    // checking if event exists in array
    const noEventMatchesCurrentID = allEvents.every((event) => (event.id !== currentEventID));
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

  function arraysAreEqual(array1, array2) {
    // checks length of arrays                if the same event is found in both arrays
    return array1.length === array2.length && array1.every((event, index) => event.id === array2[index].id);
  }

  function compareEvents(event1, event2) {
    if (isBefore(event1.start, event2.start)) {
      return -1;
    } else if (isEqual(event1.start, event2.start)) {
      return 0;
    } else if (isAfter(event1.start, event2.start)) {
      return 1;
    }
  }

  // useEffects for handling POST and GET requests -> putting on hold to implement calendar
  useEffect(() => {
    // code that relies on the updated state
    const sortedEvents = [...allEvents];
    sortedEvents.sort((a, b) => compareEvents(a, b));

    if (!arraysAreEqual(sortedEvents, allEvents)) {
      setAllEvents(sortedEvents); // only changes state if the array actually gets sorted -> prevents infinite rendering
    }

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
    <div className="font-sans my-5 w-full">
      <main className="w-full mx-auto h-auto flex flex-row">
        <form onSubmit={handleSubmit} className="text-center bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mx-5 w-min h-max border border-blue">
          <div className="mt-4">
            <label htmlFor="eventName" className="block text-left text-m font-bold mb-1">Event Name:</label>
            <input id="eventName" type="text" name="eventName" value={eventName} onChange={handleNameChange} required
              className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black" />
          </div>
          <div className="mt-4">
            <label htmlFor="eventStart" className="block text-left text-m font-bold mb-1">Event Start:</label>
            <input id="eventStart" type="datetime-local" name="eventStart" value={eventStart.toISOStringWithOffset().slice(0, 16)} onChange={handleStartChange} required
              className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black hover:cursor-pointer" />
          </div>
          <div className="mt-4">
            <label htmlFor="eventEnd" className="block text-left text-m font-bold mb-1">Event End:</label>
            <input id="eventEnd" type="datetime-local" name="eventEnd" value={eventEnd.toISOStringWithOffset().slice(0, 16)} onChange={handleEndChange} required
              className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black hover:cursor-pointer" />
          </div>
          <div className="mt-4">
            <label htmlFor="selectedEventType" className="block text-left text-m font-bold mb-1">Event Type:</label>
            <select id="selectedEventType" name="selectedEventType" value={eventType} onChange={handleTypeChange} required
              className="mx-auto w-full bg-white border border-black px-3 py-2 rounded shadow leading-tight focus:border-black hover:cursor-pointer">
              <Options categories={allEventTypes} />
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="eventDesc" className="block text-left text-m font-bold mb-1">Event Description: </label>
            <textarea id="eventDesc" name="eventDesc" value={eventDesc} onChange={handleDescChange} required className="w-full h-full py-2 px-3 rounded border border-blue shadow align-top focus:border-black" />
          </div>
          <button type="submit" className="mt-5 bg-transparent hover:bg-gray-200 font-semibold py-2 px-4 border border-blue  rounded text-center">Submit form</button>
        </form>
        <Calendar events={allEvents} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} selectedDay={selectedDay} setSelectedDay={setSelectedDay} eventsForSelectedDay={eventsForSelectedDay} setEventsForSelectedDay={setEventsForSelectedDay} handleDeleteClick={handleDeleteClick} />
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

function Calendar({ events, handleEditClick, handleSaveClick, selectedDay, setSelectedDay, eventsForSelectedDay, setEventsForSelectedDay, handleDeleteClick }) {
  const [currentDate, setCurrentDate] = useState(new CustomDate());
  // const currentDate = new CustomDate();
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
        const daysInterval = eachDayOfInterval({ start: startDateObject, end: endDateObject }); // an array of Date objects in between start, end
        let dateKeys = []; // array of dateKeys
        daysInterval.forEach((day) => {
          dateKeys.push(format(day.toLocaleDateString().split(',')[0], "yyyy-MM-dd")); // formatted date is used as the key for grouping events
        })

        dateKeys.forEach((dateKey) => {
          if (!acc[dateKey]) { // the date key doesn't exist in the accumulator object
            acc[dateKey] = []; // it creates an empty array for that date key
          }
          acc[dateKey].push(event); // pushes the current event into the array corresponding to its date key
          acc[dateKey].sort((a, b) => a.start.compareDates(b.start));
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

  const previousYear = () => setCurrentDate(sub(currentDate, {years: 1}));
  const previousMonth = () => setCurrentDate(sub(currentDate, {months : 1}));
  const nextMonth = () => setCurrentDate(add(currentDate, {months : 1}));
  const nextYear = () => setCurrentDate(add(currentDate, {years: 1}));
  const handleSetToday = () => setCurrentDate(new CustomDate());

  return (
    <div className="mx-5 w-full h-min border border-blue bg-white shadow-md rounded-xl p-5">
      <div className="grid grid-cols-8 justify-center items-center text-center font-bold text-lg">
        <div onClick={previousYear}>{"<<"}</div>
        <div onClick={previousMonth}>{"<"}</div>
        <h2 className="text-center mb-1 col-span-3">{format(currentDate, "MMMM yyyy")}</h2>
        <div onClick={handleSetToday}>Today</div>
        <div onClick={nextMonth}>{">"}</div>
        <div onClick={nextYear}>{">>"}</div>
      </div>
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
      <EventShowcase listOfEvents={eventsForSelectedDay} selectedDay={selectedDay} onClose={handleCloseClick} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} />
    </div>
  );
}

function Day({ index, day, dateKey, todaysEvents, selectedDay, onDayClick }) {
  function handleClick() {
    onDayClick(day); // sets selectedDay to day (Date object)
    console.log(day.toLocaleDateString() + " clicked");
  }

  return (
    <div key={index + day + dateKey} onClick={handleClick} className={clsx("border rounded-md p-2 text-center hover:cursor-pointer hover:bg-actualBlue-200", { "bg-gray-200 text-gray-900": isToday(day), "border-blue border-2": day.toLocaleDateString() === selectedDay })}>
      <p className="mb-2">{format(day, "d")}</p>
      {todaysEvents.map((event) => {
        return (
          <div key={event.name + dateKey + uuidv4()} className="bg-blue rounded-md text-white px-1 mb-2">
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
          (selectedDay === null) ? (<h3 className="font-bold w-auto text-xl mt-4 text-center">Your Events</h3>) : (<h3 className="font-bold w-auto text-xl mt-4 text-center">Your Events for {selectedDay}</h3>)
        }
        {
          (selectedDay === null) ? (<button onClick={onClose} className="cursor-not-allowed opacity-50 mt-3 h-auto w-auto bg-transparent text-center font-semibold py-2 px-4 border border-blue rounded">Close</button>)
            : <button onClick={onClose} className="mt-3 h-auto w-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue  rounded">Close</button>
        }
      </div>
      <EventFilter events={list} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} />
    </>
  );
}

function EventFilter({ events, handleEditClick, handleSaveClick, handleDeleteClick }) {
  // const allEventTypes[]
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (type) => {
    setSelectedTypes((previousState) => {
      if (previousState.includes(type)) {
        return previousState.filter((selected) => selected !== type);
      } else {
        return [...previousState, type];
      }
    })
  }

  const filteredEvents = events.filter((event) => selectedTypes.length === 0 || selectedTypes.includes(event.type));

  return (
    <div className="w-full h-max mt-1">
      <div className="flex items-center space-x-2 w-max h-max p-1 px-2 border-blue border-2 rounded bg-gray-200">
        <h4 className="font-bold w-auto inline-block text-lg text-center my-1">Filter Events</h4>
        <div className="space-x-2 bg-transparent p-1 my-1">
        {
          allEventTypes.map((type) => {
            return (
              <button key={type}
                onClick={() => toggleType(type)}
                className={clsx("cursor-pointer m-0 h-min w-min text-center text-sm hover:border-2 focus:border-2 font-semibold py-2 px-4 border border-blue rounded",
                  {
                    "bg-actualBlue-200 rounded-full": selectedTypes.includes(type) === true,
                    "bg-white": selectedTypes.includes(type) === false
                  })}>{type}</button>
            );
          })
        }
        </div>
      </div>

      <div className="w-full inline-block text-center">
        <EventTable events={filteredEvents} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} />
      </div>
    </div>
  );
}

function EventTable({ events, handleEditClick, handleSaveClick, handleDeleteClick }) {
  return (
    <table className="table-fixed w-full h-auto mx-auto mt-5 border">
      <thead>
        <tr className="text-left border bg-blue text-white">
          <th className="border">Name</th>
          <th className="border">Date</th>
          <th className="border">Time</th>
          <th className="border">Type</th>
          <th className="border w-1/4">Description</th>
          <th className="border">Status</th>
          <th className="border">Edit</th>
          <th className="border">Save</th>
          <th className="border">Delete</th>
        </tr>
      </thead>
      <tbody>
        {
          (events.map(event => (
            <Event key={event.id} eventObject={event} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} />
          ))
          )
        }
      </tbody>
    </table>
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
    <tr className="text-left border">
      <td>{eventObject.name}</td>
      {
        (eventObject.startDate === eventObject.endDate) ?
          (<td>{eventObject.startDate}</td>) : (<td>{eventObject.startDate + " to " + eventObject.endDate}</td>)
      }
      {
        (eventObject.startTime === eventObject.endTime) ?
          (<td>{eventObject.startTime}</td>) : (<td>{eventObject.startTime + " to " + eventObject.endTime}</td>)
      }
      <td>{eventObject.type}</td>
      <td className="break-all">{eventObject.description}</td>
        {
          (isEditing === true) ? (<td className="font-bold text-center bg-red-100">Editing...</td>) : (<td className="font-bold text-center bg-green-100">Saved</td>)
        }
      <td className="p-0 m-0">
        <button onClick={handleEdit} className="h-full w-full bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 focus:bg-gray-200">Edit</button>
      </td>
      <td className="p-0 m-0">
        <button onClick={handleSave}className="h-auto w-full bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 focus:bg-gray-200">Save</button>
      </td>
      <td className="p-0 m-0">
        <button onClick={handleDelete}className="h-auto w-full bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 focus:bg-gray-200">Delete</button>
      </td>
    </tr>
  );
}