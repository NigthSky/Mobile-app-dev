const sql = require("mssql");

var config = {
    user: "testAdmin", // Database username
    password: "Admin.123!", // Database password
    server: "localhost", // Server IP address
    database: "test1", // Database name
    options: {
        "encrypt": false // Disable encryption
    }
}
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

 export function userVerify(data) {
    new sql.Request().query("SELECT * FROM Users WHERE username = '"+data.username+"'", (err,result) => {
        if(err) {
            console.error("Error executing query:", err);
            return({type:'error', message:'Something Went Wrong!'});
        } else {
            console.log(result.recordset);
            let data = result.recordset;
            return(data);
        }
    });
}