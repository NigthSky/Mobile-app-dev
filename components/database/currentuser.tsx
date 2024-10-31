import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('users.db');

// CURRENT USER TABLE ------------------------------------------------------------
// SAVE USER INFO ON LOG IN
export const currentUserInfo = (username:string, id:number): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log('user')
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO currentuser (id, username) VALUES(?,?);`,
          [id,username],
          (_,result) => {console.log(`Current user added: `,result.rowsAffected); resolve('sucess')},
          (_,error) => {console.log('Error checking current user',error); return true;}
        );
      });
    });
  };
  
  // FETCH CURRENT USER INFO
  export const getCurrentUser = (): Promise<any> => {
    return new Promise((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM currentuser;',
          [],
          (_,result) => {
            console.log('inforamtion get on current user'); 
            console.log(result.rows.item(0));
            resolve(result.rows.item(0));
          }, 
          (_,error) => {console.log('Error getting currentuser',error); return true;}
        );
      })
    })
  }
  
  // CLEAR USER INFO ON LOG OUT
  export const removeCurrentUser = (): Promise<any> => {
    return new Promise ((resolve,reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM currentuser;`,[],
          (_,result) => {resolve('user successfully log out')},
          (_,error) => {reject(`Error logging out: ${error}`); return true}
        )
      })
    })
  }