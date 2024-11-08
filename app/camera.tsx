import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import RNFS from 'react-native-fs';

export default function Camera() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const cameraRef = useRef<any | null>(null);
  const albumName = 'TEST'; // Change this to your desired album name

  //getting permission on media-library
  useEffect(() => {
    RNFS.mkdir(`${RNFS.ExternalDirectoryPath}/photos/`);
    const checkPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'This app needs access to your media library.');
      }
    };
    checkPermissions();
  }, []);


  // Fetch assets/images from the specified album
  const fetchAssetsFromAlbum = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync(albumName);
      if (album) {
        const { assets: albumAssets } = await MediaLibrary.getAssetsAsync({
          album: album.id,
          sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Sort by creation time
          mediaType: [MediaLibrary.MediaType.photo], // Only photos
        });
        setAssets(albumAssets);
        console.log('Assets: ',assets)
      } else {
        Alert.alert('Album not found', `The album "${albumName}" does not exist.`);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      Alert.alert('Error', 'Could not fetch assets from the album.');
    }
  };

  //capture a image from camera
  const takePicture = async () => {
    if (cameraRef.current) {
      const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
      console.log(sizes);
      const photo = await cameraRef.current.takePictureAsync();
      console.log('photo: ', photo)
      setImageUri(photo.uri);
      Alert.alert('Picture taken!', 'You can save the image or take another one.');
    }
  };

  //save image to media-library
  const savePicture = async () => {
    if (imageUri) {
        const fileName = `photo_${Date.now()}.jpg`; // Unique file name
        const path = `${RNFS.PicturesDirectoryPath}/${fileName}`;
        const dir = `${RNFS.ExternalDirectoryPath}/photos/${fileName}`;
        // console.log(RNFS.ExternalDirectoryPath);
        try {
          // console.log(await RNFS.readdir(dir));
          await RNFS.moveFile(imageUri, dir);
          Alert.alert('Success', `Image saved to ${dir}`);
          // setImageUri(null);
        } catch (error) {
          console.error('Error saving image:', error);
          Alert.alert('Error', 'Failed to save the image.');
          return;
        }

    //     try {
    //         const asset = await MediaLibrary.createAssetAsync(imageUri);
    //         console.log('Asset created:', asset);

    //         let album = await MediaLibrary.getAlbumAsync(albumName);

    //         if (!album) {
    //           album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
    //           console.log('Album created:', album);
    //       } else {
    //           console.log('Album found:', album);
    //           await MediaLibrary.addAssetsToAlbumAsync([asset.id], album.id, true);
    //           await FileSystem.deleteAsync(asset.uri, { idempotent: true });
    //       }
    //         //await MediaLibrary.addAssetsToAlbumAsync([asset.id], album.id, false);
    //         Alert.alert('Success', 'Your photo has been saved to the album.');
    //         setImageUri(null);
    //     } catch (error) {
    //         console.error('Error saving the picture:', error);
    //         Alert.alert('Error', 'Could not save the picture.');
    //     }
    }
};

  //toggle camera back or front
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!cameraPermission || !mediaLibraryPermission) {
    return <View />;
  }

  if (!cameraPermission.granted || mediaLibraryPermission?.status !== 'granted') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera and access the media library</Text>
        <Button 
          onPress={() => {
            requestCameraPermission();
            requestMediaLibraryPermission();
          }} 
          title="Grant permission" 
        />
      </View>
    );
  }

  if(imageUri) {
    return(
      <View style={styles.container}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <TouchableOpacity style={{alignSelf: 'center'}} onPress={savePicture}>
            <Text style={styles.text}>Save Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => setImageUri(null)}>
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} pictureSize={'1600x1200'}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={fetchAssetsFromAlbum}>
            <Text style={styles.text}>Get Album Assets</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    width: 'auto',
    height: "68%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    width: 'auto',
    height: "68%",
    marginTop: 10,
  },
  assetList: {
    marginTop: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});
