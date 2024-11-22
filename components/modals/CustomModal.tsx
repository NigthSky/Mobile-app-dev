import React, { ReactNode, useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Button, Text, Pressable, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Camera from '../camera';
import { fetchTimelogUri, monitorCheck, SaveBio, updateData } from '../../save _and_process/timeLogs';
import Sign from '../signature';
import { fetchUser_Time_logs } from '../database/time_logs';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode; // To accept any nested content
  request?: string;
  imgData?: any;
  Disable?: boolean;
  user?: any;
}


export const BioMectrics: React.FC<CustomModalProps> = ({visible, onClose, children, imgData, user}) =>{
  const [request, setRequest] = useState<string>('')
  const [preview, setPreview] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(imgData._j);

  const getImgData = (req:string) => {
      setRequest(req);
      setPreview(true)
  }

  return(
    <Modal
        visible={visible}
        transparent={true}
        style={{justifyContent:'center', alignItems:'center'}}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={{flex:1, justifyContent:'center', alignItems:'center',  backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
          <View style={{width:'30%', borderWidth:2, padding:20, borderRadius:10, backgroundColor:'white'}}>
            {children}
            <View style={{marginBottom:7}}><Button title='Time-In' onPress={()=> {getImgData('Time-In');}}/></View>
            <View style={{marginBottom:7}}><Button title='Time-Out' onPress={()=> {getImgData('Time-Out');}}/></View>
            <View style={{marginBottom:7}}><Button title='close' onPress={onClose}/></View>
            <BioPreview visible={preview} onClose={() => setPreview(false)} request={request} imgData={record} user={user}>{children}</BioPreview>
          </View>
        </View>
      </Modal>
  );
}

const BioPreview: React.FC<CustomModalProps> = ({visible, onClose, request='', children, imgData, user}) => {
  const [cam, setCam] = useState<boolean>(false)
  const [sign, setSign] = useState<boolean>(false);
  const [data, setData] = useState<any>(imgData);
  const [disable, setDisable] = useState<boolean>();


  const savingPic = async() => {
    const data = await fetchTimelogUri();
    setData(data);
    setCam(false);
  }

  const savingSign = async() => {
    const data = await fetchTimelogUri();
    setData(data);
    setSign(false);
  }

  const saveBiometrics = async() => {
    SaveBio(request, user);
    const data = await fetchTimelogUri();
    setData(data);
  }
  
  const CheckDataCam = () => {
    if(data){
      if(request === 'Time-In' && data.INimageUri.trim()) {
        return(<Image source={{uri:data.INimageUri}} style={{width:'100%', height:'100%'}}/>)
      }
      if(request === 'Time-Out' && data.OUTimageUri.trim()) {
        return(<Image source={{uri:data.OUTimageUri}} style={{width:'100%', height:'100%'}}/>)
      }
    } 
    return(<AntDesign name="camera" size={24} color="black" onPress={() => setCam(true)} style={{alignSelf:'center'}}/>);
    
  }

  const CheckDataSign = () => {
    if(data){
      if(request === 'Time-In' && data.INsignUri && data.INsignUri.trim()) {
        return(<Image source={{uri:data.INsignUri}} style={{width:'100%', height:'100%'}}/>)
      }
      if(request === 'Time-Out' && data.OUTsignUri && data.OUTsignUri.trim()) {
        return(<Image source={{uri:data.OUTsignUri}} style={{width:'100%', height:'100%'}}/>)
      }
    } 
    return(<FontAwesome5 name="signature" size={24} color="black" onPress={() => setSign(true)} style={{alignSelf:'center'}} />)
    
  }

  return(
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <View style={{width:'40%',height:'60%',borderWidth:2, padding:20, borderRadius:10, backgroundColor:'white'}}>
            {children}
            <View style={{flex:1, flexDirection:'row',marginBottom:5}}>
              <View style={{width:'49%',padding:5, justifyContent:'center', borderWidth:1, margin:2}}>
                {CheckDataCam()}
              </View>
              <View style={{width:'49%', padding:5, justifyContent:'center', borderWidth:1,margin:2}}>
                {CheckDataSign()}
              </View>
            </View>
            <View style={{marginBottom:5}}><Button title={request} disabled={request === 'Time-Out' ? data.OutDisable : data.InDisable} onPress={saveBiometrics}/></View>
            <Button title='Close' onPress={onClose}/>
          </View>
        </View>
        <CameraPreview visible={cam} request={request} onClose={() => savingPic()}></CameraPreview>
        <SignPreview visible={sign} request={request} onClose={() => savingSign()}></SignPreview>
      </Modal> 
       
  )
}

const CameraPreview: React.FC<CustomModalProps> = ({visible, onClose, request=''}) =>{
  return(
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <View style={{height:'70%',width:'50%',justifyContent:'center', alignSelf:'center', borderWidth:2, backgroundColor:'black', padding:10, borderRadius:15}}>
            <Pressable style={{position:'absolute', top:'7%',left:10}} onPress={onClose}><AntDesign name="arrowleft" size={24} color="white"/></Pressable>
            <Text style={{height:'10%',fontSize:20, fontWeight:'bold', alignSelf:'center', color:'white',marginBottom:10}}>Take Picture</Text>
            <Camera path={request} onClose={onClose}></Camera>
          </View>
        </View>
      </Modal>
  )
}

const SignPreview: React.FC<CustomModalProps> = ({visible, onClose, request=''}) => {
  return(
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <View style={{height:'70%',width:'50%',justifyContent:'center', alignSelf:'center', borderWidth:2, padding:15, borderRadius:15, backgroundColor:'white'}}>
            <Pressable style={{position:'absolute', top:'4%',left:10}} onPress={onClose}><AntDesign name="arrowleft" size={24} color="black"/></Pressable>
            <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'center', color:'black',marginBottom:10}}>Sign</Text>
            <Sign path={request} onClose={onClose}></Sign>
          </View>
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});


