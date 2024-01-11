import React, { useState, useMemo } from "react";
import { eachDayOfInterval, endOfMonth, format, getDay, isToday, startOfMonth, sub, add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import CustomDate from "./CustomDate";
import './App.css';

export default function Calendar({ children, events, selectedDay, setSelectedDay, setEventsForSelectedDay }) {
  const [currentDate, setCurrentDate] = useState(new CustomDate());
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

  const previousYear = () => setCurrentDate(sub(currentDate, { years: 1 }));
  const previousMonth = () => setCurrentDate(sub(currentDate, { months: 1 }));
  const nextMonth = () => setCurrentDate(add(currentDate, { months: 1 }));
  const nextYear = () => setCurrentDate(add(currentDate, { years: 1 }));
  const handleSetToday = () => setCurrentDate(new CustomDate());

  return (
    <div className="mx-5 w-full h-min border border-blue bg-white shadow-md rounded-xl p-5">
      <div className="grid grid-cols-7 justify-center items-center text-center font-bold text-lg mb-1">
        <button onClick={previousYear} className="h-min w-min mx-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue rounded">{"<<"}</button>
        <button onClick={previousMonth} className="h-min w-min mx-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue rounded">{"<"}</button>
        <h2 className="text-center col-span-2 text-2xl">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={handleSetToday} className="h-min w-min mx-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue rounded">Today</button>
        <button onClick={nextMonth} className="h-min w-min mx-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue rounded">{">"}</button>
        <button onClick={nextYear} className="h-min w-min mx-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue rounded">{">>"}</button>
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
      {children}
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