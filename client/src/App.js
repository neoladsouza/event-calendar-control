import React, { useState, useMemo } from 'react';
import Form from "./Form.js";
import LabelInput from "./LabelInput.js";
import LabelTextArea from "./LabelTextArea.js";
import LabelOptions from "./LabelOptions.js";
import ExcelDisplay from "./ExcelDisplay.js";
import Calendar from "./Calendar.js";
import { EventHeader, EventFilter } from './EventComponents.js';
import CustomDate from './CustomDate.js';

import { v4 as uuidv4 } from 'uuid';
import { isBefore, isEqual, isAfter } from 'date-fns';

// make Button components

export default function FormApp() {
  const [eventName, setEventName] = useState('');
  const [eventStart, setStart] = useState(new CustomDate());
  const [eventEnd, setEnd] = useState(new CustomDate());
  const allEventTypes = ['None', 'Service', 'Appointment', 'Course', 'Workshop', 'Retreat', 'Program'];
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

  useMemo(() => {
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

  function handleNameChange(e) {
    setEventName(e.target.value);
  }
  function handleStartChange(e) {
    let startString = e.target.value; // format is 2017-06-01T08:30
    let date = new CustomDate(startString.slice(0, 16));
    setStart(date);
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
    <div className="font-sans my-5 w-full mx-auto h-auto flex flex-row">
      <section className="mx-5">
        <Form handleSubmit={handleSubmit}>
          <LabelInput id="eventName" labelText="Event Name:" type="text" value={eventName} handleChange={handleNameChange} />
          <LabelInput id="eventStart" labelText="Event Start:" type="datetime-local" value={eventStart.toISOStringWithOffset().slice(0, 16)} handleChange={handleStartChange} />
          <LabelInput id="eventEnd" labelText="Event End:" type="datetime-local" value={eventEnd.toISOStringWithOffset().slice(0, 16)} handleChange={handleEndChange} />
          <LabelOptions id="selectedEventType" labelText="Event Type:" value={eventType} handleChange={handleTypeChange} categories={allEventTypes} />
          <LabelTextArea id="eventDesc" labelText="Event Description:" value={eventDesc} handleChange={handleDescChange} />
          <button type="submit" className="mt-5 bg-transparent hover:bg-gray-200 font-semibold py-2 px-4 border border-blue  rounded text-center">Submit form</button>
        </Form>
        <ExcelDisplay allEvents={allEvents} setAllEvents={setAllEvents} />
      </section>
      <Calendar events={allEvents} selectedDay={selectedDay} setSelectedDay={setSelectedDay} setEventsForSelectedDay={setEventsForSelectedDay}>
        <EventHeader allEvents={allEvents} selectedDay={selectedDay} setSelectedDay={setSelectedDay} setEventsForSelectedDay={setEventsForSelectedDay}>
          <EventFilter events={eventsForSelectedDay} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} currentEventID={currentEventID} categories={allEventTypes} />
        </EventHeader>
      </Calendar>
    </div>
  );
}