import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

// USERS TABLE-----------------------------------------------------------------------------------
// FETCH AND VERFIY USER
export const getUser = (username: string, password:string): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT *  FROM users WHERE username = ? AND password = ?;',
          [username, password],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0));
            } else {
              resolve('Invalid username or password');
            }
          },
          (_, error) => {
            reject(error);
            return true;
          }
        );
      });
    });
  };
  
  // CHECK USER IF EXISTING
  export const Validation = (username:string): Promise<any> => {
      return new Promise((resolve,reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT * FROM users WHERE username=?;`,
                  [username],
                  (_,result) => {
                      // console.log(result.rows.item(0));
                      if(result.rows.length > 0) {
                          resolve(result.rows.item(0));
                      } else {
                          resolve(false);
                      }
                  },   
                  (_,error) => {
                      reject(error);
                      return true;
                  }
              )
          });
      });
  }
  
  // REGISTER USER ON THE LOCAL DATABASE
  export const userRegister = (id:number|null, username:string, password:string): Promise<any> => {
    console.log('id:', id, username, password)
      return new Promise((resolve, reject) => {
          db.transaction(tx =>{
              tx.executeSql(
                  `INSERT INTO users (id,username, password) VALUES (?,?,?);`,
                  [id,username,password],
                  (_, result) => {
                  if (result.rowsAffected > 0) {
                      console.log(`Users added: `,result.rowsAffected);
                      resolve('User Added Successfully');
                  } 
                  },
                  (_, error) => {
                  reject(error);
                  return true;
                  }
              )
          });
      });
  }
  
  // FETCH ALL USERS
  export const getAllusers = (): Promise<any> => {
      return new Promise((resolve, reject) => {
          db.transaction(tx => {
              tx.executeSql(
                  `SELECT * FROM users;`,
              [],
              (_,result) => {
                  console.log('all users was fecth:', result.rows._array);
                  resolve(result.rows._array);
              },
              (_,error) => {
                  console.log("Error Fetching users:", error);
                  reject(error)
                  return true;
              }
              )
          })
      })
  }

//CLEAR ALL USERS
export const clearUser = (): Promise<any> => {
    return new Promise((resolve, reject) => (
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM users;`,[],
            () => { resolve(true)},
            (_,error) => {reject(error); return false}
            )
        })
    ))
}