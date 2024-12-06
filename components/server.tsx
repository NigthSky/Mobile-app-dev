import axios from 'axios';

export const addToSever = (user:any): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Add local registered users to the server
        axios
            .post('http://192.168.0.63:9000/test/addnewuser', user)
            .then(res => {
                        let data = res.data;
                        console.log(res.data)
                        resolve(data);
                    })
            .catch(e => reject(e));
    })
}

export const getServerUsers = (): Promise<any> => {
    // request get all server users
    return new Promise((resolve,reject) => {
        axios
            .post('http://192.168.0.63:9000/test/users')
            .then (res => {
                    let data = res.data;
                    resolve(res.data);
                })
            .catch(e => reject(e));
    })
}

export const logsToSever = async(log:any): Promise<any> => {
    //create new form data
    const getFileName = (path:string) => {
        const pathParts = path.split('/');
        console.log('path Parts: ', pathParts[pathParts.length - 1]);
        return pathParts[pathParts.length - 1];
      };

    console.log('data/ logs :' , log)
    return new Promise((resolve,reject) => {
        resolve(true);
        const formData = new FormData();
        axios
        .post('http://192.168.0.63:9000/test/timelogs/check', log)
        .then(res => {
            console.log('get from the server:',res.data);
            
            //condition if ( time log was exist all ready do an update)
            if (Array.isArray(res.data) && res.data.length > 0) {
                console.log('if : ');
                formData.append('type', 'Time-Out');
                formData.append('time_out', log.time_out);
                formData.append('time_in', log.time_in);
                formData.append('user_id', log.user_id);
                formData.append('coordTime_out', log.coordTime_out);
                formData.append('locTime_out', log.locTime_out);
                log.imgtime_out ?  formData.append('photo', {
                    uri: log.imgtime_out,
                    name: getFileName(log.imgtime_out), // Ensure the name is valid
                    type: 'image/jpeg', // Ensure the correct MIME type
                  } as any): null;
                log.signtime_out ? formData.append('sign', {
                    uri: log.signtime_out,
                    name:  getFileName(log.signtime_out), // Ensure the name is valid
                    type: 'image/jpeg', // Ensure the correct MIME type
                  } as any): null;
                axios
                    .post('http://192.168.0.63:9000/test/timelogs/update',formData, { 
                        headers: {
                        'Content-Type': 'multipart/form-data',
                    }})
                    .then(res => {
                        console.log("if server data:",res.data);
                        resolve('sucess update');
                    })
                    .catch(e => {reject(e)});
            } 
            // INSERT the time log if not exist
            else { 
                console.log('else: ',res.data);
                formData.append('date',log.date); 
                formData.append('type', 'Time-In');
                formData.append('time_in', log.time_in);
                formData.append('user_id', log.user_id);
                formData.append('coordTime_in', log.coordTime_in);
                formData.append('locTime_in', log.locTime_in);
                log.imgtime_in ?  formData.append('photo', {
                    uri: log.imgtime_in,
                    name: getFileName(log.imgtime_in), // Ensure the name is valid
                    type: 'image/jpeg', // Ensure the correct MIME type
                  } as any): null;
                log.signtime_in ? formData.append('sign', {
                    uri: log.signtime_in,
                    name: getFileName(log.signtime_in), // Ensure the name is valid
                    type: 'image/jpeg', // Ensure the correct MIME type
                  } as any): null;
                axios
                    .post('http://192.168.0.63:9000/test/timelogs/insert', formData, { 
                        headers: {
                        'Content-Type': 'multipart/form-data',
                    }})
                    .then(res => {
                        resolve('sucess insert');
                    })
                    .catch(e => reject(e));
                    }
        })
        .catch(e => {
            reject(e);
        });
    });
}