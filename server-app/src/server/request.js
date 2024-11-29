import axios from 'axios';

export const getAttendance = () => {
    return new Promise((resolve, reject) => {
        axios
            .post ('http://192.168.0.63:9000/test/attendance')
            .then (res => {
                console.log(res.data)
                resolve(res.data);
            })
            .catch(e => reject(e));
    })
    
}