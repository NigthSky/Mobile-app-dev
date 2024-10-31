import { View , Text , StyleSheet, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getCurrentUser, removeCurrentUser } from '../components/database/currentuser'
import { time_IN,time_OUT, fetchUser_Time_logs, clearTimeLogs } from '../components/database/time_logs';
import { sycnTimelogs } from "../components/synchronize";



export default function Profile(userData:any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>('');
    const [userLogs, setUserLogs] = useState<Array<{user_id:number, date:string, time_in:string, time_out:string}>>();
    
    // GET USER INFO
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response);
                return;
            } catch(error) {
                console.log('Error fetching user data', error);
                return;
            }
        };

        fetchUserData();
    }, []);
    

    // LOGOUT USER
    const logOut = async() => {
        try {
            const remove = await removeCurrentUser();
            alert(remove);
            router.replace('/');
            return;
        }
        catch(error){
            console.log('Error on Loging out', error)
            return;
        }
    };

    // PROCESS TIME IN
    const timeIn = async() => {
        try {
            const In = await time_IN(user.id);
            alert(In);
            return;
        }
        catch(error) {
            alert(error)
            return;
        }
    }

    // PROCESS TIME OUT
    const timeOut = async() => {
        try {
            const Out = await time_OUT(user.id);
            alert(Out);
            return;
        }
        catch(erorr) {
            alert(erorr);
            return;
        }
    }

    // USER TIME LOGS
    const UserTimeLogs = async() => {
        try{
            const userTimeLogs = await fetchUser_Time_logs(user.id)
            if(userTimeLogs) {
                setUserLogs(userTimeLogs);
                return;
            }
        }
        catch(error) {
            alert(error);
            return;
        }
    }

    const sycnLogs = async() => {
        setLoading(true);
        try{
            const sync = await sycnTimelogs()
            if(sync) {
                alert(sync)
                return;
            }
        }
        catch(error) {
            alert(error);
            return;
        } 
        finally {
            setLoading(false);
        }
    }

    const clearLogs = async() => {
        try {
            const clr = await clearTimeLogs();
            return;
        }
        catch(error) {
            alert(error)
        }
    }


    if(loading) {
        return (
          <View style={{flex:1 , justifyContent:'center', alignItems:'center',backgroundColor: 'rgba(52, 52, 52, 0.3)'}}>
            <Text style={{fontSize:30}}>Loading....</Text>
          </View>
        )
      }
    return (
        
        <View style={styles.profileView}>
            <Text style={styles.text}> Hello {user.username}</Text>
            <Pressable onPress={timeIn} style={styles.logOutButton}><Text>TIME - IN</Text></Pressable>
            <Pressable onPress={timeOut} style={styles.logOutButton}><Text>TIME - OUT</Text>
            </Pressable><Pressable onPress={UserTimeLogs} style={styles.logOutButton}><Text>get Time Logs</Text>
            </Pressable><Pressable onPress={sycnLogs} style={styles.logOutButton}><Text>Sycn Time Logs</Text>
            </Pressable><Pressable onPress={clearTimeLogs} style={styles.logOutButton}><Text>CLear Time Logs</Text>
            </Pressable><Pressable onPress={logOut} style={styles.logOutButton}><Text>Log out</Text>
            </Pressable>
            <View style={{marginTop:20,alignItems:'center'}}>
                    <Text style={{padding:5,fontWeight:"bold",fontSize:20}}> Time Logs</Text>
                    <FlatList       
                        data={userLogs}
                        renderItem={({ item }) => <Text>Date: {item.date} Time In: {item.time_in} Time Out: {item.time_out}</Text>}
                    />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileView: {
        flex: 1,
        justifyContent:'center',
    },
    text: {
        alignSelf:'center',
        marginBottom:10,
    },
    logOutButton: {
        padding:5,
        marginBottom: 5,
        borderRadius: 4,
        backgroundColor: '#3399ff',
        alignItems:'center',
      },
});