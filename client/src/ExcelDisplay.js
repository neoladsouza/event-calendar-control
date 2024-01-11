import React, { useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from 'uuid';
import CustomDate from "./CustomDate";
import './App.css';

export default function ExcelDisplay({ allEvents, setAllEvents }) {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setExcelData(parsedData);
    }
  }

  function excelEvents() {
    const updatedEvents = [...allEvents];
    excelData.forEach((row) => {
      let newEvent = {
        name: row["Name"],
        start: new CustomDate(row["Start Date"].replaceAll("/", "-")), // CustomDate object
        end: new CustomDate(row["Start Date"].replaceAll("/", "-")), // CustomDate object
        startDate: row["Start Date"],
        endDate: row["End Date"],
        startTime: row["Start Time"],
        endTime: row["End Time"],
        type: row["Type"],
        description: row["Description"],
        id: row["Name"] + uuidv4(),
      }
      newEvent.start.setHours(Number(newEvent.startTime.slice(0, 2)));
      newEvent.start.setMinutes(Number(newEvent.startTime.slice(3, 5)));
      newEvent.end.setHours(Number(newEvent.endTime.slice(0, 2)));
      newEvent.end.setMinutes(Number(newEvent.endTime.slice(3, 5)));
      updatedEvents.push(newEvent);
    });
    setAllEvents(updatedEvents);
  }

  return (
    <div className="text-center bg-white shadow-md rounded-xl px-8 pt-6 pb-8 my-5 w-full h-max border border-blue">
      <label htmlFor="eventFile" className="block text-left text-m font-bold mb-1">Event File:</label>
      <input id="eventFile" onChange={handleFileUpload} type="file" accept=".xlsx, .xls" name="eventStart" required
        className="mx-auto shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight border-blue focus:border-black hover:cursor-pointer" />
      <button onClick={excelEvents} className="mt-5 bg-transparent hover:bg-gray-200 font-semibold py-2 px-4 border border-blue  rounded text-center">Load Excel Events</button>

      {
        excelData.length > 0 &&
        <table>
          <thead>
            <tr>
              {Object.keys(excelData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}