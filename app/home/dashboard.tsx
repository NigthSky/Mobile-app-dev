import { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, Alert, Pressable, Image, ScrollView } from 'react-native';
import { fetchUser_Time_logs } from '../../components/database/time_logs';
import { getCurrentUser } from '../../components/database/currentuser';
import { fetchTimelogUri, monitorCheck, updateData } from '../../save _and_process/timeLogs';
import {BioMectrics } from '../../components/modals/CustomModal';
import { useGlobalSearchParams } from 'expo-router';


export default function Dashboard() {
  const extra = useGlobalSearchParams();
  const [loaing, setLoading] = useState<boolean>(false)
  const [attendance, setAttendance] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState('');
  const [user, setUser] = useState<any| null> (extra);
  const [userLogs, setUserLogs] = useState<any|null>(null);
  const [record, setRecord] = useState<any>();
  
  useEffect(() => {
    const getReadyData = async() => {
      try {
          const responce = await getCurrentUser();
          // setUser(responce);
          const res = await fetchUser_Time_logs(user.id);
          console.log("responce: ",res)
          setUserLogs(res);
          const check = await monitorCheck(res);
          console.log(check)
          if(check) {
            updateData(check)
          } else {
            updateData(check)
          }
          setRecord(fetchTimelogUri)
          console.log(record)
      }
      catch(err) {
        alert(err)
      }
    }
    getReadyData();
  },[])



  // Function to format time with AM/PM
  const formatTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour time
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };
  


  // Update the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);


    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const testlist = [
    'User',
    'Code',
    'Time-in',
    'Time-Out',
    'Time-In-Coodinate',
    'Time-Out-Coodinate',
    'Time-In-Location',
    'Time-Out-Location',
    'Time-In-Image',
    'Time-Out-Image',
    'Time-In-Signature',
    'Time-Out-Signature',
  ];

  // Function to get user data based on the current header
  const getUserData = (item:any, logs:any) => {
    switch (item) {
      case 'User':
        return <Text>{user.username}</Text>
      case 'Code':
        return <Text>{logs.user_id}</Text>;
      case 'Time-in':
        return <Text>{logs.time_in}</Text>;
      case 'Time-Out':
        return <Text>{logs.time_out}</Text>;
      case 'Time-In-Coodinate':
        return <Text>{logs.coordTime_in}</Text>;
      case 'Time-Out-Coodinate':
        return <Text>{logs.coordTime_out}</Text>;
      case 'Time-In-Location':
        return <Text>{logs.locTime_in}</Text>;
      case 'Time-Out-Location':
        return <Text>{logs.locTime_out}</Text>;
      case 'Time-In-Image':
        if(!logs.imgtime_in ||!logs.imgtime_in.trim()){
          return '';
        }
        return <Image source={{uri:logs.imgtime_in}} style={{height:50}}/>;
      case 'Time-Out-Image':
        if(!logs.imgtime_out || !logs.imgtime_out.trim()) {
          return '';
        }
        return <Image source={{uri:logs.imgtime_out}} alt='out' style={{height:50}}/>;
      case 'Time-In-Signature':
        if(!logs.signtime_in || !logs.signtime_in.trim()) {
          return '';
        }
        return <Image source={{uri:logs.signtime_in}} style={{height:50}}/>;
      case 'Time-Out-Signature':
        if(!logs.signtime_out || !logs.signtime_out.trim()){
          return '';
        }
        return <Image source={{uri:logs.signtime_out}} alt='out' style={{height:50}}/>;;
      default:
        return '';
    }
  };


  const refresh = async() => {
    try {const res = await fetchUser_Time_logs(user.id);
      setUserLogs(res);
    }
    catch(err){ alert(err)}
  }

  if(!record) {
    return(
        <Modal>
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>Loading.....</Text>
          <Button title='Cancle' onPress={() => setLoading(false)}/>
          </View>
        </Modal>
    )
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* TIme IN - Time OUT Modal */}
      <BioMectrics visible={attendance} onClose={() => setAttendance(false)} imgData={record} user={user}>
         <Text style={{fontSize:30, fontWeight:'bold', alignSelf:'center', marginBottom:5}}>{currentTime}</Text>
      </BioMectrics>

      {/* Home Display */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Attendance</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={testlist}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ marginRight: 10}}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item}</Text>
              <FlatList
                data={userLogs}
                keyExtractor={(user, index) => index.toString()}
                renderItem={({ item: logs }) => (
                  <View style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 10, marginBottom: 5 ,height:60,justifyContent:'center',}}>
                    {getUserData(item, logs)}
                  </View>
                )}
              />
            </View>
          )}
        />
      </ScrollView>
      <Button title='Time-In / Time-Out' onPress={() => {setAttendance(true);}}/>
      <View style={{marginTop:5}}><Button title='Refresh' onPress={refresh}/></View>
    </View> 
    
  );
}
