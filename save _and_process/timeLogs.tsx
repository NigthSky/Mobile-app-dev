import { Alert } from "react-native";
import { addMonitor, checkMonitor, time_IN, time_OUT } from "../components/database/time_logs";
import { location } from "../components/location";
import RNFS from 'react-native-fs';


const options: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Manila', // Set timezone to Philippines (GMT+8)
  month: 'short', // Abbreviated month (e.g., "Nov")
  day: '2-digit', // Day of the month (e.g., "20")
  year: 'numeric', // Full year (e.g., "2024")
  hour: '2-digit', // Hour (e.g., "09")
  minute: '2-digit', // Minutes (e.g., "29")
  second: '2-digit', // Seconds (e.g., "04")
  hour12: true, // Use 12-hour format
};
 
const formattedTime = () => {
    return(new Intl.DateTimeFormat('en-US', options).format(new Date));
}
const dateOnly = () => {
    return(formattedTime().split(",")[0] + "," + formattedTime().split(",")[1]) 
}

console.log(formattedTime)
console.log(formattedTime().split(",")[0] + "," + formattedTime().split(",")[1]);

const data = {
    INimageUri: '',
    INsignUri: '',
    OUTimageUri: '',
    OUTsignUri: '',
    CoordIn: '',
    CoordOut: '',
    LocIn: '',
    LocOut: '',
    TimeIn: '',
    TimeOut: '',
    InDisable: false,
    OutDisable: false,
}

const saveCamPics = async(path:string, user:any) => {
    const fileName = `${user.username}_${formattedTime()}.jpg`; // Unique file name
    const trimName = fileName.replace(/\s+/g, '').trim();
    const removeComma = trimName.replace(/,/g, '-')
    const finalname = removeComma.replace(/:/g, '-')
        const dir = `${RNFS.ExternalDirectoryPath}/photos/Attendance/${path}/camera/${finalname}`;
        try {
            if(path === 'Time-In' && data.INimageUri.trim()) {
                await RNFS.moveFile(data.INimageUri, dir);
                data.INimageUri = `file://${dir}`;
            }
            if(path === 'Time-Out' && data.OUTimageUri.trim()) {
                await RNFS.moveFile(data.OUTimageUri, dir);
                data.OUTimageUri = `file://${dir}`;
            }
            return;
        } catch (error) {
          console.error('Error saving image:', error);
          Alert.alert('Error', 'Failed to save the image.');
          return;
        }
}


const saveSignPics = async (path:string, user:any) => {
    const fileName = `${user.username}_${formattedTime()}.jpg`;
    const trimName = fileName.replace(/\s+/g, '').trim();
    const removeComma = trimName.replace(/,/g, '-')
    const finalname = removeComma.replace(/:/g, '-')
    const dir = `${RNFS.ExternalDirectoryPath}/photos/Attendance/${path}/signature/${finalname}`;
    try {
        if(path === 'Time-In' && data.INsignUri.trim()) {
            await RNFS.moveFile(data.INsignUri, dir);
            data.INsignUri = `file://${dir}`;
            return;
        }
        if(path === 'Time-Out' && data.OUTsignUri.trim()) {
            await RNFS.moveFile(data.OUTsignUri, dir);
            data.OUTsignUri = `file://${dir}`;
            return;
        }
        return;
    }
    catch(err) {
        console.error('Error saving image:', err);
        Alert.alert('Error', 'Failed to save the image.');
        return;
    }
}

export const SaveBio = async(req:string,user:any) =>{
    if(user) {
    try{
        const coord = await location();
        console.log('coordinate',coord);
        if(req === 'Time-In') {
            if(!data.INimageUri.trim() && !data.INsignUri.trim()) {
                alert('Please Take Photo Or Sign to Time-In')
                return;
            }
            data.CoordIn = coord.coordinate;
            data.LocIn = coord.address ?? 'Unknown';
            data.TimeIn = formattedTime();
            await saveCamPics(req, user);
            await saveSignPics(req, user);
            console.log(data);
            const save = await time_IN(user.id, data);
            alert(save);
            data.InDisable = true;
            return;
        }
        if(req === 'Time-Out') {
            if(!data.OUTimageUri.trim() && !data.OUTsignUri.trim()) {
                alert('Please Take Photo Or Sign to Time-Out')
                return;
            }
            data.CoordOut = coord.coordinate;
            data.LocOut = coord.address ?? 'Unknown';
            data.TimeOut = formattedTime();
            await saveCamPics(req, user)
            await saveSignPics(req, user);
            console.log(data);
            const update = await time_OUT(user.id, data);
            alert(update);
            data.OutDisable = true;
            return;
            }
        }
        catch(err) {
            alert(err)
            return;
        }
    } 
}


export const setCam = (path:string, uri:string) => {
    console.log(path, uri)
    if(path === 'Time-In') {
        data.INimageUri = uri;
    }  
    if(path === 'Time-Out'){
        data.OUTimageUri = uri;
    }
    return;
}

export const setSign = (path:string, uri:string) => {
    console.log(path, uri)
    if(path === 'Time-In') {
        data.INsignUri =`file://${uri}`;
    } 
    if(path === 'Time-Out'){
        data.OUTsignUri =`file://${uri}`;
    }
    return;
}

export const fetchTimelogUri = ():Promise<any> => {
    return new Promise((resolve) => {
        resolve(data);
    })
}

export const monitorCheck = async( logs:any) => {
    try{
        for(const log of logs) {
            let trim = log.time_in.split(",")[0] + "," + log.time_in.split(",")[1]
            if(trim === dateOnly()){
                return(log);
            }
        }
        return(false);
    }
    catch(err) {
        alert(err);
        return;
    }
}

export const updateData = (log:any) => {
    console.log('log: ', log.imgtime_out);

        data.INimageUri = log.imgtime_in ?? '';
        data.INsignUri = log.signtime_in ?? '';
        data.OUTimageUri = log.imgtime_out ?? '';
        data.OUTsignUri  = log.signtime_out ?? '';
        data.CoordIn = log.coordTime_in ?? '';;
        data.CoordOut = log.coordTime_out ?? '';
        data.LocIn = log.locTime_in ?? '';;
        data.LocOut = log.locTime_out ?? '';
        data.TimeIn = log.time_in ?? '';;
        data.TimeOut = log.time_out ?? ''; 
        if(log.imgtime_in !== '' && log.imgtime_in || log.signtime_in !== '' && log.signtime_in) {
            data.InDisable = true;
        } else { data.InDisable = false;}
        if(log.imgtime_out !== '' &&log.imgtime_out || log.imgtime_out !== '' && log.imgtime_out) {
            console.log('dasdasdasd')
            data.OutDisable = true;
        } else {data.OutDisable = false; }
        console.log(data);
    return;
}