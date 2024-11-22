import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

export const createTable = () => {

  // TABLES CREATION --------------------
  db.transaction(tx => {
    // USER TABLE
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL);',
      [],
      () => { console.log('Table users created successfully!'); },
      (_, error) => { console.error('Error creating table:', error); return true }
    );

    // CURRENT USER TABLE
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS currentuser (id INT NOT NULL, username TEXT NOT NULL );',
      [],
      () => {console.log('Table currentuser created successfully!'); },
      (_,error) => { console.error('Error creating table:', error); return true }
    );

    //ADDED USER TABLE
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS addeduser (username TEXT NOT NULL, password TEXT NOT NULL);',
      [],
      () => {console.log('Table addeduser created successfully!'); },
      (_,error) => { console.error('Error creating table:', error); return true }
    );

    // image id input
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS time_logs(
        id INTEGER PRIMARY KEY NOT NULL,
        user_id INT NOT NULL,
        time_in TEXT,
        time_out TEXT,
        imgtime_in TEXT, 
        imgtime_out TEXT,
        signtime_in TEXT,
        signtime_out TEXT,
        coordTime_in TEXT,
        coordTime_out TEXT,
        locTime_in TEXT,
        locTime_out TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id));`,
      [],
      () => {console.log('Table time_logs created successfully!')},
      (_,error) => {console.log('Error creating table:', error); return true}
    )
    // tx.executeSql(
    //   `INSERT INTO time_logs (user_id,time_in,imgtime_in,signtime_in,coordTime_in,locTime_in)
    //   VALUES (
    //     1,
    //     'Nov 20, 2024, 9:56:18 AM',
    //     'file:///storage/emulated/0/Android/data/com.nigthsky00.myapp/files/photos/Attendance/Time-in/camera/photo_1732070400854.jpg',
    //     'file:///storage/emulated/0/Android/data/com.nigthsky00.myapp/files/photos/Attendance/Time-in/signature/sign_1732070406933.jpg',
    //     '111248484, 546454545',
    //     'Madaluyong'
    //     )`,[],
    //     () => {console.log('Insert success')},
    //     (_,err) => {console.log('error on inserting', err); return true}
    // )
  });
};