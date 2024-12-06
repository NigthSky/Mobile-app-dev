import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { sycnTimelogs } from '../../components/synchronize';

export default function TabLayout() {

  const sycn = async() => {
    try {
      const result = await sycnTimelogs();
      if(result) {
        console.log(result);
        alert(result);
      }
    }
    catch (error:any) {
      if (error.response) {
          console.log(error.response.data)
          alert(`Error: ${error.response.data.error}`);
      } else {
          console.error('Error:', error.message);
          alert(`Error: ${error.message}`);
      }
  }
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerRight: () => (
            <TouchableOpacity style={{marginEnd:20}}><AntDesign name="sync" size={24} color="black" onPress={sycn}/></TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}