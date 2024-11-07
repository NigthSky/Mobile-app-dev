import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';


export default function test() {

    useEffect(() => {
        (async() => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need permission to access your media library.');
            }
        })();
    }, []);


    //retrieve album
    //retrive images
    // "-1033159534" id
     // const album = await MediaLibrary.getAlbumAsync("TEST");
            // const asset:any = await MediaLibrary.getAssetsAsync({album:album});
            // console.log('album: ', album);
            // console.log('Assest01: ', asset);
    //{"albumId": "-1033159534", "creationTime": 0, "duration": 0, "filename": "89742b04-6958-4056-8541-3ce8103c3e5b.jpg", "height": 3264, "id": "1000006557", "mediaType": "photo", "modificationTime": 1730766392000, "uri": "file:///storage/emulated/0/Pictures/TEST/89742b04-6958-4056-8541-3ce8103c3e5b.jpg", "width": 2448}
    const uploadImage = async() => {
        const formData = new FormData();
        formData.append('file', {
            uri: "file:///storage/emulated/0/DCIM/sign (3).jpg",
            name: 'photo.jpg', // Change the name as necessary
            type: 'image/jpeg', // Ensure this matches the image type
        } as any);
        
        try {
            const response = await axios.post('http://192.168.0.63:9000/test/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload successful:', response.data);
            Alert.alert('Success', 'Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Could not upload the image.');
        }
    };


    return(
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Button title="Upload" onPress={uploadImage}/>
        </View>
    )
}

//send image to end point