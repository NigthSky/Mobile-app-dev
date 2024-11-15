import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal } from 'react-native';

export default function Dashboard() {
  const [loaing, setLoading] = useState<boolean>(false)
  const [attendance, setAttendance] = useState<boolean>(false)

  const [currentTime, setCurrentTime] = useState('');

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

  const testusers = [
    {
      user: 'admin',
      code: 1,
      timeIn: 'Nov 15, 2024, 7:59:31 AM',
      timeOut: 'Nov 15, 2024, 5:06:20 PM',
      timeInCoodinate: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeOutCoodinate: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeInLocation: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeoutLocation: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeInImage: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeOutImage: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeInSignature: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeOutSignature: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
    },
    {
      user: 'User',
      code: 2,
      timeIn: 'Nov 15, 2024, 7:59:31 AM',
      timeOut: 'Nov 15, 2024, 5:06:20 PM',
      timeInCoodinate: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeOutCoodinate: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeInLocation: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeoutLocation: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeInImage: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeOutImage: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeInSignature: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
      timeOutSignature: '69 Maysilo Cir, Mandaluyong, 1550 Metro Manila',
    },
  ];

  // Function to get user data based on the current header
  const getUserData = (item:any, user:any) => {
    switch (item) {
      case 'User':
        return user.user;
      case 'Code':
        return user.code;
      case 'Time-in':
        return user.timeIn;
      case 'Time-Out':
        return user.timeOut;
      case 'Time-In-Coodinate':
        return user.timeInCoodinate;
      case 'Time-Out-Coodinate':
        return user.timeOutCoodinate;
      case 'Time-In-Location':
        return user.timeInLocation;
      case 'Time-Out-Location':
        return user.timeoutLocation;
      case 'Time-In-Image':
        return user.timeInImage;
      case 'Time-Out-Image':
        return user.timeOutImage;
      case 'Time-In-Signature':
        return user.timeInSignature;
      case 'Time-Out-Signature':
        return user.timeOutSignature;
      default:
        return '';
    }
  };

  if(loaing) {
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
      <Modal
        visible={attendance}
        transparent={true}
          style={{justifyContent:'center', alignItems:'center'}}
          animationType="slide"
      >
      <View style={{flex:1, width:'40%', justifyContent:'center', alignSelf:'center',}}>
        <View style={{borderWidth:2, padding:20, borderRadius:10}}>
          <Text style={{fontSize:40, fontWeight:'bold', alignSelf:'center'}}>{currentTime}</Text>
          <Button title='Time-In' onPress={() => setAttendance(false)}/>
          <Button title='Time-Out' onPress={() => setAttendance(false)}/>
          <Button title='close' onPress={() => setAttendance(false)}/>
        </View>
      </View>
      </Modal>
      
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Attendance</Text>
      <FlatList
        data={testlist}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginRight: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item}</Text>
            <FlatList
              data={testusers}
              keyExtractor={(user, index) => index.toString()}
              renderItem={({ item: user }) => (
                <View style={{ padding: 5, backgroundColor: '#ddd', borderRadius: 10, marginBottom: 5 }}>
                  <Text>{getUserData(item, user)}</Text>
                </View>
              )}
            />
          </View>
        )}
      />
      <Button title='Time-In / Time-Out' onPress={() => setAttendance(true)}/>
    </View> 
  );
}
