import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import RNFS from 'react-native-fs';


export default function test() {

    useEffect(() => {
        (async() => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need permission to access your media library.');
            }
        })();
    }, []);

    const [imageUri, setImageUri] = useState<string>();
    const getImage = () => {
        const path = `file://${RNFS.ExternalDirectoryPath}/photos/photo_1731025264805.jpg`
        console.log(path);
        setImageUri(path);
        return;
    }

    const uploadImage = async() => {
        const path = `${RNFS.ExternalDirectoryPath}/photos`;
        const files = await RNFS.readdir(path);
        console.log(files);
        
        
        try {
            for(const photo of files) {
                const formData = new FormData();
                formData.append('file', {
                    uri: `file://${RNFS.ExternalDirectoryPath}/photos/${photo}`,
                    name: photo, // Change the name as necessary
                    type: 'image/jpeg', // Ensure this matches the image type
                } as any);
                const response:any = await axios.post('http://192.168.0.63:9000/test/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Upload successful:', response.data);
                Alert.alert('Success', 'Image uploaded successfully!');
            }

        } catch (error:any) {
            if (error.response) {
                console.log(error.response.data)
                alert(`Error: ${error.response.data.error}`);
            } else {
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };


    return(
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Button title="Upload" onPress={uploadImage}/>
            <Button title="check Image" onPress={getImage}/>
           {/* <Image
                source={{uri:'file:///storage/emulated/0/Android/data/com.nigthsky00.myapp/files/photos/photo_1731038101769.jpg'}}
                style={{width:200, height:200}}
            /> */}
        </View>
    )
}

//send image to end point