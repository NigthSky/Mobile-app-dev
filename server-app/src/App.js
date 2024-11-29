import React, { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { getAttendance } from './server/request';


const App = () => {

  const [selectedDate, setSelectedDate] = useState('11/30/2024');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div style={{width:'80%', height: 400, margin: 'auto',padding:2, border: '1px dashed red'}}>
      <div style={{backgroundColor:'#75A4D1', color:'white', fontWeight: 'bold', padding: 5}}><text>Attendance Report</text></div>
      <div>
        <label for='distric'>District: </label>
        <select name='distric'>
          <option value={0}>All District</option>
        </select>
        <label for='teritory'>Teritory: </label>
        <select name='teritory'>
          <option value={0}>All Teritory</option>
        </select>
        <label for='user_type'>User Type: </label>
        <select name='user_type'>
          <option value={0}>Field Represnetative</option>
        </select>
        <div>
      <h3>Select a Date</h3>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{ padding: '10px', fontSize: '16px' }}
      />
      {selectedDate && <p>You selected: {selectedDate}</p>}
    </div>
        <text>Date From: </text>
        <text>Date To: </text>
        <text>Field Represnetative: </text>
        <text>Search: </text>
        <text>Download: </text>
        <text>Print Report: </text>
      </div>
    </div>
  );
};


export default App;
