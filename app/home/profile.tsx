import { View , Text , StyleSheet, Pressable, FlatList, Button } from "react-native";
import { useEffect, useState } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import { getCurrentUser, removeCurrentUser } from '../../components/database/currentuser'
import { time_IN,time_OUT, fetchUser_Time_logs, clearTimeLogs } from '../../components/database/time_logs';
import { sycnTimelogs } from "../../components/synchronize";



export default function Profile() {
    const extra = useGlobalSearchParams()
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<any>(extra);
    const [userLogs, setUserLogs] = useState<Array<{user_id:number, date:string, time_in:string, time_out:string}>>();
    
    // GET USER INFO
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getCurrentUser();
                // setUser(response);
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

    const clearLogs = async() => {
                try {
                    const clr = await clearTimeLogs();
                    return;
                }
                catch(error) {
                    alert(error)
                }
            }

    return (
        <View style={styles.profileView}>
            <Text style={{alignSelf:'center', marginBottom:10, fontSize:30, fontWeight:'bold'}}>Hello: {user.username}</Text>
            <Button title="clear Logs" onPress={clearLogs}/>
            <Button title="Log Out" onPress={logOut}/>
        </View>
    )
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