import { Text, View, Pressable ,TextInput, StyleSheet, Platform, FlatList, Image } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { createTable } from '../components/database/create_database'
import { getUser,getAllusers } from '../components/database/users';
import { currentUserInfo } from '../components/database/currentuser';
import {addLocaluser, synchronize} from '../components/synchronize'


export default function Index() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any>();
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  let Users;
    
  //ROUTES
  const  gotoRegister = () => {
    router.push("./Register");
  }

  //----------------------------------------


  // DATABASE CONNECTION AND TABLE CREATION
  useEffect(() => {
    createTable(); // Create table on component mount
  }, []);


  //LOCAL DATA BASE REQUEST--------------------------

  //LOG IN Process
  const fetchUser = async () => {
    if(!username.trim() || !password.trim()) {
      return alert('Username and password cannot be Empty');
  }
    setMessage('');
    setPassword('');
    setUsername('');
    try {
      const userData = await getUser(username, password);
      console.log('Fetched user data:', userData);
      if (typeof userData === 'object' && userData !== null && !Array.isArray(userData)) {
        const add = await currentUserInfo(userData.username, userData.id);
        alert(`Log in Successfully`);
        router.replace("/Profile")
      } else {
        alert(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setMessage(`Error fetching user ${error}`);
      alert(message);
    }
  };

  //GET ALL USERS.
  const getAllUsers = async ()  => {
    //Get All users
    setMessage('');
    setIsLoading(true);
    try {
      const users = await getAllusers();
      console.log(users);
      setAllUsers(users)
      setShowAllUsers(true);
      setIsLoading(false);
    }
    catch(error) {
      console.log(`Error fetching users`, error);
      setMessage(`Error fetching users ${error}`)
    }
     
  }

  //--------------------------------------------------
  
 //PROCESS SYNC
  const synchronizeStart = async () => {
      setIsLoading(true);
      try {
          const localToServer = await addLocaluser();
  
          if (localToServer) {
            console.log('ads',localToServer);
              const syncResult = await synchronize();
              alert(syncResult); // Log the result of synchronization
              
          }
          setIsLoading(false);
      } catch (error) {
          console.error('Error on processing Synchronize:', error);
          setIsLoading(false);
      } 
  };


// RENDERING (VIEWS)
  if(showAllUsers) {
        Users = <View style={{marginTop:20,alignItems:'center'}}>
                    <Text style={{padding:5,fontWeight:"bold",fontSize:20}}> All Users</Text>
                    <FlatList       
                        data={allUsers}
                        renderItem={({ item }) => <Text>username: {item.username}</Text>}
                        keyExtractor={(item) => item.id}    
                    />
                    <Pressable style={styles.loginButton} onPress={() => setAllUsers(false)}><Text style={{textAlign:'center'}}>Close</Text></Pressable>
                </View>    
    }

  if(isLoading) {
    return (
      <View style={{flex:1 , justifyContent:'center', alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)'}}>
        <Text style={{fontSize:30}}>Loading....</Text>
      </View>
    )
  }
  return (
    <View>
      <TextInput value={username} style={styles.logInput} placeholder="Username" onChangeText={text => setUsername(text)}/>
      <TextInput value={password} style={styles.logInput} placeholder="Password" onChangeText={text => setPassword(text)}/>
      <Pressable style={styles.loginButton} onPress={fetchUser}><Text>Log in</Text></Pressable>
      <Pressable style={styles.loginButton} onPress={gotoRegister}><Text>Register</Text></Pressable>
      <Pressable style={styles.loginButton} onPress={synchronizeStart}><Text>Synchronize</Text></Pressable>
      <Pressable style={styles.loginButton} onPress={getAllUsers}><Text>Get ALL Users</Text></Pressable>
      <Pressable style={styles.loginButton} onPress={() => router.push('./camera')}><Text>Camera</Text></Pressable>
      {Users}
    </View>
  );
}

const styles = StyleSheet.create({
  logInput: {
    borderRadius: 10,
    borderColor: 'black',
    padding:10,
    borderWidth: 1,
  },
  loginButton: {
    padding:5,
    marginBottom: 5,
    borderRadius: 4,
    backgroundColor: '#3399ff',
    alignItems: 'center',
  },
});