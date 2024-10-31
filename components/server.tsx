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

export const logsToSever = (log:any): Promise<any> => {
    return new Promise((resolve,reject) => {
        axios
        .post('http://192.168.0.63:9000/test/timelogs/check', log)
        .then(res => {
            console.log('get from the server:',res.data);
            
            //condition if ( time logs was exist all ready do an update)
            if (Array.isArray(res.data) && res.data.length > 0) {
                console.log('if : ');
                axios
                    .post('http://192.168.0.63:9000/test/timelogs/update',log)
                    .then(res => {
                        console.log("if server data:",res.data);
                        resolve('sucess update');
                    })
                    .catch(e => {reject(e)});
            } 
            // INSERT the time log if not exist
            else { 
                console.log('else: ',res.data);
                axios
                    .post('http://192.168.0.63:9000/test/timelogs/insert', log) 
                    .then(res => {
                        let data = res.data;
                        console.log('else: server result:', res.data);
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