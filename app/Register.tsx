import { TextInput, Pressable, View, StyleSheet,Text } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { userRegister, Validation } from "../components/database/users"
import { userLocalAdded} from '../components/database/adddeduser';

export default function Register() {
    // const [userRegister, setUserRegiter] = useState({username:'', password:'',confirmPass: '', type:'Register'});
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [message, setMessage ] =  useState<string | null>(null)


    const handleRegistered = async () => {
        console.log('Checking user:', username , password, confirmPass);
        if(!username.trim() || !password.trim()) {
            return alert('Username and password cannot be Empty');
        }
        if(password !== confirmPass) {
            return alert('Password is not match')
        }
        try {
            const validate = await Validation(username);

            if(validate){
                console.log(validate);
                return alert('User already exists!');
            }
            console.log(validate);
            
            const responce = await userRegister(null,username, password);
            console.log('Get Responce:', responce);
            const add = await userLocalAdded(username, password);
            alert(responce);
            if(responce) {
                setPassword('');
                setUsername('');
                setConfirmPass('');
                router.replace("./");
            } else {
                return;
            }
        } catch (error) {
        //   console.error('Error fetching user:', error);
          setMessage(`Error Registering User ${error}`);
          alert(message);
        }
      };
    // function Checkinfo() {
    //     setUserRegiter({username:userRegister.username, password: '', confirmPass: '', type:userRegister.type});
    //     if(userRegister.password !== userRegister.confirmPass ) {
    //         alert("Password Don't Match");
    //         return;
    //     } 
    //     const userData = {username: userRegister.username, password: userRegister.password};
    //     console.log(`the type is ${userRegister.type}`)

    //     axios 
    //     .post('http://192.168.0.63:9000/Register', userData)
    //     .then(res => {
    //         let data = res.data;
    //         console.log(res.data);
    //         if(res.data.type !== "error" || !res.data.type) {
    //             alert(data);
    //             router.replace('/');
    //         } else {
    //             alert(res.data.message);
    //             return;
    //         }
    //     })
    //     .catch(e => console.log(e));

    // }

    return(
        <View style={styles.registerView}>
            <TextInput value={username} style={styles.regInput } placeholder="Username" onChangeText={text => setUsername(text) }/>
            <TextInput value={password} style={styles.regInput } placeholder="Password" onChangeText={text => setPassword(text)}/>
            <TextInput value={confirmPass} style={styles.regInput } placeholder="Confirm Password" onChangeText={text => setConfirmPass(text)}/>
            <Pressable style={styles.registerButton} onPress={handleRegistered}><Text>Register</Text></Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    registerView: {
        flex:1,
        padding: 10,
    },
    regInput: {
        borderRadius: 10,
        borderColor: 'black',
        padding:10,
        borderWidth: 1,
    },
    registerButton: {
        padding:5,
        marginBottom: 5,
        borderRadius: 4,
        backgroundColor: '#3399ff',
        alignItems: 'center',
    },
});