const express = require("express");
const sql = require("mssql");
const bodyParser = require('body-parser');
// const userVerify = require("./UserVerify.js");
const app = express();
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

// var cors = require('cors')
app.use(cors());


// SQL Server configuration
var config = {
    user: "testAdmin", // Database username
    password: "Admin.123!", // Database password
    server: "localhost", // Server IP address
    database: "test1", // Database name
    options: {
        "encrypt": false // Disable encryption
    }
}

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});


//GET ALL USERS FOR SYCHRONIZE
app.post("/test/users", (req, res) => {
    new sql.Request().query(`SELECT * FROM Users`, (err, result) => {
        if(err) {
            console.log("Error executing query:", err);
        } else {
            console.log('result:',result.recordset);
            res.send(result.recordset); // Send query result as response
        }
    })
})

app.post("/test/addnewuser", (req, res) => {
    console.log('request body:', req.body);
    new sql.Request()
        .input('username', sql.VarChar, req.body.username)
        .input('password', sql.VarChar, req.body.password)
            .query(`INSERT INTO Users (username, password) VALUES(@username, @password);`,
            (err,result) => {
                if(err) {
                    res.send('Error adding user')
                } else {
                    console.log('User added successfully');
                    res.send('User added successfully'); 
                }
            }
        );
})


app.post('/test/timelogs/check', (req,res) => {
    new sql.Request()
        .input('date', sql.VarChar, req.body.date)
        .input('user_id', sql.Int, req.body.user_id)
        .query('SELECT * FROM time_logs WHERE user_id = @user_id AND date = @date;',
            (err,result) => {
                if(err) {
                    res.send('Error adding user', err);
                } else {
                    console.log('record set',result.recordset);
                    res.send(result.recordset);
                }
            }
        )
});

app.post('/test/timelogs/update', (req,res) => {
    new sql.Request()
            .input('user_id', sql.Int, req.body.user_id)
            .input('date', sql.VarChar, req.body.date)
            .input('time_in', sql.VarChar, req.body.time_in)
            .input('time_out', sql.VarChar, req.body.time_out)
            .query(
                `UPDATE time_logs 
                SET time_in = @time_in, time_out = @time_out 
                WHERE user_id = @user_id AND date = @date;`,
                (err,result) => {
                    if(err) {
                        res.send(err)
                    } else {
                        console.log('update sucessfully')
                        res.send('update sucessfully')
                    }
                })
});

app.post('/test/timelogs/insert', (req,res) => {
    console.log('request: ', req.body);
    new sql.Request()
            .input('user_id', sql.Int, req.body.user_id)
            .input('date', sql.VarChar, req.body.date)
            .input('time_in', sql.VarChar, req.body.time_in)
            .input('time_out', sql.VarChar, req.body.time_out)
            .query(`INSERT INTO time_logs(user_id, date, time_in, time_out) VALUES(@user_id, @date, @time_in, @time_out);`,
        (err,result) => {
            if(err) {
                res.send(err);
            } else {
                console.log('sucess');
                res.send('success');
            }
        }
    )
});


app.get('/', (req,res) => {
    res.send(`SERVER`)
}) ;

// Start the server on port 3000
app.listen(9000, () => {
    console.log("Listening on port 9000...");
});