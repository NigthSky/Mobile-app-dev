import * as SQLite from 'expo-sqlite/legacy';
import { getAddedUsers, removeAddedUser } from './database/adddeduser';
import { addToSever, getServerUsers, logsToSever } from './server';
import { clearUser, userRegister } from './database/users';
import { fetchTime_Logs } from './database/time_logs';

const db = SQLite.openDatabase('users.db');

interface User {
    id: number;
    username: string;
    password: string;
}

interface added {
    username: string;
    password: string;
}

export const addLocaluser = async() => {
    const addedUsers = await getAddedUsers(); // get users registered locally
        const toserver:  added[] = addedUsers;
        console.log(toserver);
        if(addedUsers.length > 0) {
            console.log('added to server:', toserver);
            for (const user of toserver) {
                console.log('user :', user);
                await addToSever(user); // Await each call to ensure it's completed
            }
            const remove = await removeAddedUser();
            return true;
        } else {
            return true;
        }
}

export const synchronize = async() => {
    try {
        const responce = await getServerUsers(); // get server users
            const serverUsers: User[] = responce;
            if(responce && responce.length > 0) {
                console.log('responce:',serverUsers);
                const clear = await clearUser(); // clear users db
                console.log('clear:', clear)
                for (const user of serverUsers) {
                    console.log('user',user) 
                    await userRegister(user.id, user.username, user.password); // add every server user to the local user db
                }
                console.log('synchonizing users to the server success!'); 
                return('srychonizing users to the server success!');
            } else {
                return('Error No data get from the server');
            }
    }
    catch(error) {
        return (error);
    }
}

// PROCESS SYCN TIMe LOGS
export const sycnTimelogs = async() => {

        try{
            const tLogs = await fetchTime_Logs(); //get user time logs in local db.
            if(tLogs) {
                for(const log of tLogs) {
                    const addlog = await logsToSever(log); //Send time logs data to the server.
                }
                return('sycn log successfully');
            } else {
                return ('Error on getting time logs');
            }
            
        }
        catch(error) {
            console.log(error);
            return 'Synchronization failed';  
        }

}