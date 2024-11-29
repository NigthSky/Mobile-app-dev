import React, { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { getAttendance } from './server/request';

const App = () => {
  const [attendance, setAttendance] = useState(null);

  const handleGetAttendance = async() => {
    try{
      const result = await getAttendance();
      if(result) {
        setAttendance(result);
        return;
      }
    } catch (err) {
      alert(err);
      return;
    }
  }

  const listAttedance = () => {
    if (attendance && attendance.length > 0) {
      return attendance.map((data, index) => (
        <tr key={index}>
          <td>{data.username}</td>
          <td>{data.user_id}</td>
          <td>{data.time_in}</td>
          <td>{data.time_out}</td>
          <td>{data.coordtime_in}</td>
          <td>{data.coordtime_out}</td>
          <td>{data.loctime_in}</td>
          <td>{data.loctime_out}</td>
          <td>{data.imgtime_in}</td>
          <td>{data.imgtime_out}</td>
          <td>{data.signtime_in}</td>
          <td>{data.signtime_out}</td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan="12" style={{ textAlign: 'center' }}>
            No attendance records available.
          </td>
        </tr>
      );
    }
  };

  return(
    <div>
      <h3>Attendance</h3> 
      <button onClick={handleGetAttendance}>get Attendance</button>
      <div style={{overflow:'auto', width:'80%', height:'50%'}}>
        <table style={{width:2000, padding:20}}>
          <thead>
            <tr>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>User</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Code</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-In</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-Out</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-In Coordinates</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-Out Coordinates</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-In Location</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-Out Location</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-In Image</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-Out Image</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-In Signature</th>
              <th style={{fontSize:10, backgroundColor:'green', border: '1px solid black', width:100}}>Time-Out Signature</th>
            </tr>
          </thead>
          <tbody>
            {listAttedance()}
            <img src='C:\Users\ITSUPPORT\Desktop\MyFolder\mobile app\images\signitures\photo.jpg' width="500" height="600"/>
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default App;
