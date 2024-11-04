import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function Camera() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const cameraRef = useRef<any | null>(null);
  const albumName = 'DCIM'; // Change this to your desired album name

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'This app needs access to your media library.');
      }
    };
    checkPermissions();
  }, []);

  const createAlbumIfNotExists = async () => {
    try {
      const albums = await MediaLibrary.getAlbumsAsync();
      const albumExists = albums.some(album => album.title === albumName);

      if (!albumExists) {
        await MediaLibrary.createAlbumAsync(albumName);
        Alert.alert('Album created', `Album "${albumName}" has been created.`);
      } else {
        Alert.alert('Album exists', `The album "${albumName}" already exists.`);
      }
    } catch (error) {
      console.error('Error creating album:', error);
      Alert.alert('Error', 'Could not create the album.');
    }
  };

  // Fetch assets from the specified album
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

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setImageUri(photo.uri);
      Alert.alert('Picture taken!', 'You can save the image or take another one.');
    }
  };

  const savePicture = async () => {
    if (imageUri) {
      try {
        await MediaLibrary.createAssetAsync(imageUri);
        Alert.alert('Photo saved!', 'Your photo has been saved to the gallery.');
        await createAlbumIfNotExists(); // Create album after saving the photo
        setImageUri(null); // Reset imageUri after saving
      } catch (error) {
        console.error('Error saving the picture:', error);
        Alert.alert('Error', 'Could not save the picture.');
      }
    }
  };

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

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
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
      {imageUri && (
        <View>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <Button title="Save Picture" onPress={savePicture} />
        </View>
      )}
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        )}
        horizontal
        style={styles.assetList}
      />
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
    flex: 1,
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
    width: '100%',
    height: 200,
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
