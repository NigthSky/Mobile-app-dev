import React, { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { getAttendance } from './server/request';

const exampleData = [{
  username: 'main',
  user_id: 1,
  time_in: 'Nov 27, 2024, 11:03:00 AM',
  time_out: 'Nov 27, 2024, 11:03:00 AM',
  coordtime_in: '14.4773204, 121.0326014',
  coordtime_out: '14.4773204, 121.0326014',
  loctime_in: '74 Maysilo Cir, 1550 Metro Manila',
  loctime_out: '74 Maysilo Cir, 1550 Metro Manila',
  imgtime_in: '../images/photo1.jpg',
  imgtime_out: '../images/photo1.jpg',
  signtime_in: '../images/photo.jpg',
  signtime_out: '../images/photo.jpg'
}];

const App = () => {
  const [attendance, setAttendance] = useState(null);

  const handleGetAttendance = async () => {
    // Uncomment and handle the actual API call
    // try {
    //   const result = await getAttendance();
    //   if (result) {
    //     setAttendance(result);
    //     return;
    //   }
    // } catch (err) {
    //   alert('Error fetching attendance');
    //   return;
    // }
    setAttendance(exampleData);  // For now, use the mock data
  };

  const listAttendance = () => {
    if (attendance && attendance.length > 0) {
      return attendance.map((data, index) => (
        <tr key={index}>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.username}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.user_id}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.time_in}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.time_out}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.coordtime_in}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.coordtime_out}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.loctime_in}</text></td>
          <td style={styles.tableData}><text style={{fontSize:10}}>{data.loctime_out}</text></td>
          <td style={styles.tableData}>{data.imgtime_in && <img src={data.imgtime_in} alt="Time-In" style={styles.img} />}</td>
          <td style={styles.tableData}>{data.imgtime_out && <img src={data.imgtime_out} alt="Time-Out" style={styles.img} />}</td>
          <td style={styles.tableData}>{data.signtime_in && <img src={data.signtime_in} alt="Sign-In" style={styles.img} />}</td>
          <td style={styles.tableData}>{data.signtime_out && <img src={data.signtime_out} alt="Sign-Out" style={styles.img} />}</td>
        </tr>
      ));
    } 
  };

  return (
    <div style={{flex:1}}>
      <h3>Attendance</h3>
      <button onClick={handleGetAttendance}>Get Attendance</button>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <td style={styles.tableHead}>User</td>
              <td style={styles.tableHead}>Code</td>
              <td style={styles.tableHead}>Time-In</td>
              <td style={styles.tableHead}>Time-Out</td>
              <td style={styles.tableHead}>Time-In Coordinates</td>
              <td style={styles.tableHead}>Time-Out Coordinates</td>
              <td style={styles.tableHead}>Time-In Location</td>
              <td style={styles.tableHead}>Time-Out Location</td>
              <td style={styles.tableHead}>Time-In Image</td>
              <td style={styles.tableHead}>Time-Out Image</td>
              <td style={styles.tableHead}>Time-In Signature</td>
              <td style={styles.tableHead}>Time-Out Signature</td>
            </tr>
          </thead>
          <tbody>
            {listAttendance()}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

const styles = {
  tableContainer: {
    width: '80%',
    height: '400px',
    // background: 'green',
    overflow: 'auto',
    position: 'relative',
    margin: 'auto',
     border: '1px solid black'
  },
  table: {
    width: '120%',
    tableLayout: 'fixed',  // Ensures the table columns have a fixed width and won't stretch to fit content
    // borderCollapse: 'collapse'
    // borderCollapse: 'collapse', // Optional: Can be added if you want to collapse table borders
  },
  tableHead: {
    fontSize: 10,  // Reduced font size for smaller text
    backgroundColor: 'green',
    color: 'white',  // Ensure header text is white for contrast
    border: '1px solid black',
    textAlign: 'center',
    height: '10px',  // Reduced height for smaller header cells
    width: '100px', // Adjust width to fit content
    padding: '5px', // Add some padding for better alignment
  },
  tableData: {
    textAlign: 'center',
    backgroundColor: '#ddd',
    padding: '10px',
    height: 50,
    width: 300,
  },
  img: {
    height: 50,
    width: 50,
  },
  noData: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#999',
    padding: '10px',
  },
};
export default App;
