import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, Pressable, } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import RNFS from 'react-native-fs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { setCam } from '../save _and_process/timeLogs';

interface CameraProps {
  path: string;
  onClose: () => void;
}



const Camera: React.FC<CameraProps> = ({path, onClose}) =>{
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const cameraRef = useRef<any | null>(null);
  const [fileLocation, setFileLocation] = useState<boolean | null>();

  //getting permission on media-library
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'This app needs access to your media library.');
      }
    };
    checkPermissions();
  }, []);

  //capture a image from camera
  const takePicture = async () => {
    if (cameraRef.current) {
      // const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
      // console.log(sizes);
      const photo = await cameraRef.current.takePictureAsync();
      console.log('photo: ', photo)
      setImageUri(photo.uri);
      Alert.alert('Picture taken!', 'You can save the image or take another one.');
    }
  };

  //save image 
  const savePicture = async () => {
    if (imageUri) {
        setCam(path, imageUri);
        setFileLocation(true);
        onClose();
        return;
        // const fileName = `photo_${Date.now()}.jpg`; // Unique file name
        // const dir = `${RNFS.ExternalDirectoryPath}/photos/Attendance/${path}/camera/${fileName}`;
        // try {
        //   await RNFS.moveFile(imageUri, dir);
        //   setFileLocation(true);
        //   Alert.alert('Success', `Image saved to ${dir}`);
        //   setImageUri(null);
        //   onClose();
        //   return;
        // } catch (error) {
        //   console.error('Error saving image:', error);
        //   Alert.alert('Error', 'Failed to save the image.');
        //   return;
        // }
    }
};

 const retake = () => {
  setFileLocation(null);
  setImageUri(null);
 }
  //toggle camera back or front
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!cameraPermission || !mediaLibraryPermission) {
    return <View />;
  }

  if (!cameraPermission.granted || mediaLibraryPermission?.status !== 'granted') {
    return (
      <>
        <Text style={styles.message}>We need your permission to show the camera and access the media library</Text>
        <Button 
          onPress={() => {
            requestCameraPermission();
            requestMediaLibraryPermission();
          }} 
          title="Grant permission" 
        />
      </>
    );
  }

  if(imageUri) {
    return(
      <View style={{height:'90%'}}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <View style={{flex:1,alignItems:'center', flexDirection:'row', height: '15%'}}>
          <TouchableOpacity style={fileLocation ? {width:'100%', alignItems:'center'}:{width:'50%', alignItems:'center'}} onPress={() => setImageUri(null)}>
            <MaterialIcons name="cameraswitch" size={30} color="white" />
          </TouchableOpacity>
          {fileLocation ? <></> : 
             <TouchableOpacity style={{width:'50%', alignItems:'center'}}  onPress={savePicture}>
             <MaterialIcons name="save-alt" size={30} color="white" />
           </TouchableOpacity>
          }
          </View>
      </View>
    )
  }

  return (
    <View style={{height:'80%'}}>
      <CameraView style={{height:'100%'}} facing={facing} ref={cameraRef} pictureSize={'1280x720'} ratio='16:9'>
        <TouchableOpacity style={{borderWidth:3, width:40, height:40 ,borderRadius:100, alignSelf:'center', position:'absolute', bottom:20, borderColor:'white'}} onPress={takePicture}></TouchableOpacity>
      </CameraView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    height: '90%',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    alignSelf:'center',
    width: '85%',
    height: "85%",
    marginTop: 10,
  },
});

export default Camera;