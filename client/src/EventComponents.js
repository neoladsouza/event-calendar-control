import React, { useState } from "react";
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit, FaRegSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IconContext } from "react-icons";
import './App.css';

export function EventHeader({ children, selectedDay, allEvents, setSelectedDay, setEventsForSelectedDay }) {
  function handleCloseClick() {
    setSelectedDay(null);
    setEventsForSelectedDay(allEvents); // allEvents
  }

  return (
    <div className="min-w-full">
      <div className="w-full h-auto m-0 flex flex-row justify-between">
        {
          (selectedDay === null) ? (<h3 className="font-bold w-auto text-xl mt-4 text-center">Your Events</h3>) : (<h3 className="font-bold w-auto text-xl mt-4 text-center">Your Events for {selectedDay}</h3>)
        }
        {
          (selectedDay === null) ? (<button onClick={handleCloseClick} className="cursor-not-allowed opacity-50 mt-3 h-auto w-auto bg-transparent text-center font-semibold py-2 px-4 border border-blue rounded">Close</button>)
            : <button onClick={handleCloseClick} className="mt-3 h-auto w-auto bg-transparent text-center hover:bg-gray-200 font-semibold py-2 px-4 border border-blue  rounded">Close</button>
        }
      </div>
      <div className="min-w-full">
        {children}
      </div>
    </div>
  );
}

export function EventFilter({ credentials, events, handleEditClick, handleSaveClick, handleDeleteClick, currentEventID, categories }) {
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

  const filteredEvents = events.filter((event) => (selectedTypes.length === 0 || selectedTypes.includes(event.type)));
  // when screen size gets small enough - set categories div to w-full ig idk imo keep tailwind here but obvi make css classes next week
  return (
    <div className="w-full h-max mt-1">
      
      <div className="w-max flex flex-row flex-wrap items-center space-x-2 py-1 border-blue border-2 rounded bg-gray-200">
        <h4 className="font-bold w-auto inline-block text-md text-center">Filter Events</h4>
        
        <div className="w-auto">
          {
            categories.map((type) => {
              return (
                <button key={type}
                  onClick={() => toggleType(type)}
                  className={clsx("mx-1 p-1 inline-block text-center text-sm hover:bg-actualBlue-200 focus:border-2 font-semibold border border-blue rounded",
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
        <EventTable credentials={credentials} events={filteredEvents} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} currentEventID={currentEventID} />
      </div>
      
    </div>
  );
}

export function EventTable({ events, handleEditClick, handleSaveClick, handleDeleteClick, currentEventID, credentials }) {
  return (
    <table className="min-w-full mx-auto mt-5 border">
      <thead>
        {
          credentials === null ?
            <tr className="text-left bg-blue text-white">
              <th className="" scope="col">Name</th>
              <th className="" scope="col">Date</th>
              <th className="" scope="col">Time</th>
              <th className="" scope="col">Type</th>
              <th className="w-1/4" scope="col">Description</th>
            </tr>
            :
            <tr className="text-left bg-blue text-white">
              <th className="" scope="col">Name</th>
              <th className="" scope="col">Date</th>
              <th className="" scope="col">Time</th>
              <th className="" scope="col">Type</th>
              <th className="w-1/4" scope="col">Description</th>
              <th className="" scope="col">Status</th>
              <th className="" scope="col"> </th>
              <th className="" scope="col"> </th>
              <th className="" scope="col"> </th>
            </tr>
        }
      </thead>
      <tbody>
        {
          (events.map(event => (
            <Event credentials={credentials} key={event.id + uuidv4()} eventObject={event} handleEditClick={handleEditClick} handleSaveClick={handleSaveClick} handleDeleteClick={handleDeleteClick} currentEventID={currentEventID} />
          ))
          )
        }
      </tbody>
    </table>
  );
}

function Event({ credentials, eventObject, handleEditClick, handleSaveClick, handleDeleteClick, currentEventID }) {
  function handleEdit() {
    handleEditClick(eventObject);
  }

  function handleSave() {
    handleSaveClick();
  }

  function handleDelete() {
    handleDeleteClick(eventObject);
  }

  return (
    <tr className="border border-actualBlue-200">
      <td className="text-left w-1/9">{eventObject.name}</td>
      {
        (eventObject.startDate === eventObject.endDate) ?
          (<td className="text-right whitespace-nowrap">{eventObject.startDate}</td>) : (<td className="whitespace-nowrap">{eventObject.startDate + " to " + eventObject.endDate}</td>)
      }
      {
        (eventObject.startTime === eventObject.endTime) ?
          (<td className="text-right whitespace-nowrap">{eventObject.startTime}</td>) : (<td className="whitespace-nowrap">{eventObject.startTime + " to " + eventObject.endTime}</td>)
      }
      <td className="w-1/9">{eventObject.type}</td>
      <td className="w-32 max-h-16 overflow-auto text-left">{eventObject.description}</td>
      {
        credentials && ((currentEventID === eventObject.id) ? (<td className="font-bold text-center bg-red-100">Editing...</td>) : (<td className="font-bold text-center bg-green-100">Saved</td>))
      }
      {
        credentials &&
        <td className="w-min">
          <IconContext.Provider value={{ color: "#120930", size: "2rem", className: "react-icons" }}>
            <div className=" hover:bg-gray-200">
              <FaEdit onClick={handleEdit} />
            </div>
          </IconContext.Provider>
        </td>
      }
      {
        credentials &&
        <td className="w-min">
          <IconContext.Provider value={{ color: "#120930", size: "2rem", className: "react-icons" }}>
            <div className=" hover:bg-gray-200">
              <FaRegSave onClick={handleSave} />
            </div>
          </IconContext.Provider>
        </td>
      }
      {
        credentials &&
        <td className="w-min">
          <IconContext.Provider value={{ color: "#120930", size: "2rem", className: "react-icons" }}>
            <div className=" hover:bg-gray-200">
              <MdDelete onClick={handleDelete} />
            </div>
          </IconContext.Provider>
        </td>
      }
    </tr>
  );
}