import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

// ADDED USER TABLE (FOR SYNC) --------------------------------------------------
// ADD NEW REGISTER USER
export const userLocalAdded = (username:string, password:string): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO addeduser (username,password) VALUES (?,?);', [username, password],
        (_,result) => { resolve('added')},
        (_,error) => {
          console.log("Error Fetching users:", error);
          reject(error)
          return true;
        }
        )
      })
    });
  }
  
  // GET ALL ADDED USER
  export const getAddedUsers =  (): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM addeduser;',[],
          (_,result) => {console.log(result.rows._array); resolve(result.rows._array)},
          (_,error) => {reject(error); return true}
        )
      })
    })
  }
  
  // CLEAR ADDED TABLE
  export const removeAddedUser = ():Promise<any> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM addeduser;',[],
          (_,result) => {resolve('Deleted')},
          (_,error) => {reject(error); return true}
        )
      })
    })
  }