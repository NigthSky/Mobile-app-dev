import React, { useState } from "react";
import { StyleSheet, Text, View, Image,Alert } from "react-native";
import Signature from "react-native-signature-canvas";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import RNFS from 'react-native-fs';
import { setSign } from "../save _and_process/timeLogs";

interface SignProps {
  path: string;
  onClose: () => void;
}

const Sign: React.FC<SignProps> = ({path, onClose}) => {

  const handleOK = async(signature:any) => {
    const fileName = `sign_${Date.now()}.jpg`;
    const tempPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    await RNFS.writeFile(tempPath, signature.replace("data:image/png;base64,", ""), 'base64');
    setSign(path, tempPath);
    onClose();
    return;
    // const dir = `${RNFS.ExternalDirectoryPath}/photos/Attendance/${path}/signature/${fileName}`;
    // try {
    //   const save = await RNFS.moveFile(tempPath, dir);
    //   Alert.alert('Success', 'Signature saved!');
    // }
    // catch(err) {
    //   alert(err)
    // }
    
  };

  const handleEmpty = () => {
  };

  const style = 
  `.m-signature-pad {
    position: fixed;
    margin:auto; 
    top: 0; 
    width:100%;
    height:85%;
  }
  .m-signature-pad--footer {

    .button {
      background-color: red;
      color: #FFF;
    }
  }
    `;
  return (
    <View style={{ flex: 1 }}>
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});

export default Sign;