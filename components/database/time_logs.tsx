import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

// TABLE time_logs------------------------------------------------------------

// INSERT TIME IN------------------------------------------------------------
export const time_IN = (user_id:number,data:any): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO time_logs (user_id, time_in, imgtime_in, signtime_in, coordTime_in, locTime_in) VALUES (?,?,?,?,?,?);',
          [
            user_id,
            data.TimeIn,
            data.INimageUri,
            data.INsignUri,
            data.CoordIn,
            data.LocIn
          ],
          (_,result) => {
            console.log(result.rowsAffected)
            resolve('time in success')
          },
          (_,error) => {reject(error); return true}
        )
      })
    })
  }
  
  // INSERT TIME OUT -------------------------------------------------------
  export const time_OUT = (id:number, data:any): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE time_logs
            SET time_out = ?,
              imgtime_out =?,
              signtime_out =?,
              coordTime_out =?,
              locTime_out =?
            WHERE user_id =? AND time_in =?;`, 
          [
            data.TimeOut,
            data.OUTimageUri,
            data.OUTsignUri,
            data.CoordOut,
            data.LocOut,
            id,
            data.TimeIn
          ],
          (_,result) => {console.log(result.rowsAffected); resolve(`You have successfully time out`)},
          (_,error) => {reject(`Error on time out ${error}`); return true}
        )
      })
    })
  }
  
  // GET ALL TIME LOGS
  export const fetchTime_Logs = (): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM time_logs;`, [],
          (_,result) => {console.log(result.rows._array); resolve(result.rows._array)},
          (_,error) => {reject(`error fetching time logs: ${error}`); return true}
        )
      })
    })
  }
    
  // GET TIME LOGS FOR SPECIFIC USER
  export const fetchUser_Time_logs = (id:number): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM time_logs WHERE user_id = ?;`, [id],
          (_,result) => {resolve(result.rows._array)},
          (_,error) => {reject(`error fetching time logs: ${error}`); return true}
        )
      })
    })
  }
  
  // clear all time logs
  export const clearTimeLogs = (): Promise<any> =>{
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM time_logs`,[],
          () => {resolve(true)},
          (_,error) => {reject(error); return true}
        )
      })
    })
  }

// time log MOnitoring Request
  export const addMonitor = (id:number,date:string): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO timelogsmonitor(user_id,date)
          VALUES(?,?)`,[id,date],
          () => {resolve('Success')},
          (_,err) => {reject(err); return true}
        )
      })
    }) 
  }


  export const checkMonitor = (id:number, date:string): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM timelogsmonitor WHERE user_id =? AND date =?`,[id,date],
          (_,result) => {resolve(result.rows._array)},
          (_,err) => {reject(err); return true}
        )
      })
    })
  }