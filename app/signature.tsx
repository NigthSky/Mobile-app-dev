import React, { useState } from "react";
import { StyleSheet, Text, View, Image,Alert } from "react-native";
import Signature from "react-native-signature-canvas";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function signature() {

  const handleOK = async(signature:any) => {
    const path = FileSystem.cacheDirectory + "sign.jpg";
    FileSystem.writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      { encoding: FileSystem.EncodingType.Base64 }
    )
    const asset = await MediaLibrary.createAssetAsync(path);
    
    Alert.alert('Success', 'Signature saved to your media library as JPEG!');
  };

  const handleEmpty = () => {
  };

  const style = 
  `.m-signature-pad {
    position: fixed;
    margin:auto; 
    top: 0; 
    width:100%;
    height:90%
  },
  .m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
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