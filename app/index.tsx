import { Text, View, Pressable ,TextInput, StyleSheet, Platform, FlatList, Image,StatusBar, Modal, Touchable, TouchableOpacity } from "react-native";
import { useEffect, useState, } from "react";
import { router, useSegments } from "expo-router";
import { createTable } from '../components/database/create_database'
import { getUser,getAllusers } from '../components/database/users';
import { currentUserInfo } from '../components/database/currentuser';
import {addLocaluser, synchronize} from '../components/synchronize'
import * as ScreenOrientation from 'expo-screen-orientation';
import Register from '../components/Register';
import AntDesign from '@expo/vector-icons/AntDesign';





export default function Index() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<any>();
  const [register, setRegister] =useState<boolean>(false);
  let Users;
  
  
  

  // DATABASE CONNECTION AND TABLE CREATION
  useEffect(() => {
    createTable(); // Create table on component mount
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);


  //LOCAL DATA BASE REQUEST--------------------------

  //LOG IN Process
  const fetchUser = async () => {
    console.log('got in')
      router.replace("/home");
  //   if(!username.trim() || !password.trim()) {
  //     return alert('Username and password cannot be Empty');
  // }
  //   setMessage('');
  //   setPassword('');
  //   setUsername('');
  //   try {
  //     const userData = await getUser(username, password);
  //     console.log('Fetched user data:', userData);
  //     if (typeof userData === 'object' && userData !== null && !Array.isArray(userData)) {
  //       const add = await currentUserInfo(userData.username, userData.id);
  //       alert(`Log in Successfully`);
  //       router.replace("/(tabs)")
  //     } else {
  //       alert(userData);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user:', error);
  //     setMessage(`Error fetching user ${error}`);
  //     alert(message);
  //   }
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
      // setIsLoading(true);
      // try {
      //     const localToServer = await addLocaluser();
  
      //     if (localToServer) {
      //       console.log('ads',localToServer);
      //         const syncResult = await synchronize();
      //         alert(syncResult); // Log the result of synchronization
              
      //     }
      //     setIsLoading(false);
      // } catch (error) {
      //     console.error('Error on processing Synchronize:', error);
      //     setIsLoading(false);
      // } 
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
    <View style={{
      alignItems: 'center',
      flex: 1,
      justifyContent:'center'
      }}>
        <View style={styles.logIn}>
          <Text style={{alignSelf:'center', fontWeight:'bold', fontSize:20, marginBottom:10}}>LOG IN</Text>
          <TextInput value={username} style={styles.logInput} placeholder="Username" onChangeText={text => setUsername(text)}/>
          <TextInput value={password} style={styles.logInput} placeholder="Password" onChangeText={text => setPassword(text)}/>
          <Pressable style={styles.loginButton} onPress={fetchUser}><Text>Log in</Text></Pressable>
          <Pressable style={styles.loginButton} onPress={() => setRegister(true)}><Text>Register</Text></Pressable>
          <Pressable style={styles.loginButton} onPress={synchronizeStart}><Text>Sync Users</Text></Pressable>
          {/* <Pressable style={styles.loginButton} onPress={getAllUsers}><Text>Get ALL Users</Text></Pressable>
          <Pressable style={styles.loginButton} onPress={() => router.push('/camera')}><Text>Camera</Text></Pressable>
          <Pressable style={styles.loginButton} onPress={() => router.push('/signature')}><Text>signature</Text></Pressable>
          <Pressable style={styles.loginButton} onPress={() => router.push('./test')}><Text>test</Text></Pressable>
          <Pressable style={styles.loginButton} onPress={() => router.push('./location')}><Text>Location</Text></Pressable> */}
          {/* <Pressable style={styles.loginButton} onPress={() => router.push('./screenOrientation')}><Text>Screen Orientation</Text></Pressable> */}
          {/*  {Users} */}
      </View>
      <Modal
          visible={register}
          transparent={false}
          style={{
            flex:1,
            alignItems:'center',
            justifyContent:'center' }}
            animationType="slide"
          > 
          <View style={styles.registerView}>
            <View style={{borderWidth:2, padding:20, borderRadius:10}}>
              <TouchableOpacity 
                style={{ position:'absolute', left:10, top:10, padding:5, borderRadius:5}} onPress={() => setRegister(false)}
                activeOpacity={0.2} 
              >
              <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
              
              <Text style={{alignSelf:'center', fontWeight:'bold', fontSize:20, marginBottom:10}}>REGISTER</Text>
              <Register/>
            </View>
          </View>
          </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  registerView: {
    flex:1,
    padding: 10,
    width:'40%',
    alignSelf:'center',
    justifyContent:'center',
},
  logIn: {
    width:'40%',
    padding: 20,
    borderWidth:2,
    borderRadius:10
  },
  logInput: {
    borderRadius: 10,
    borderColor: 'black',
    padding:10,
    borderWidth: 1,
    margin:5
  },
  loginButton: {
    margin:5,
    padding:10,
    borderRadius: 10,
    backgroundColor: '#3399ff',
    alignItems: 'center',
  },
});