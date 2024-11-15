const express = require("express");
const sql = require("mssql");
const bodyParser = require('body-parser');
// const userVerify = require("./UserVerify.js");
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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


// Multer storage configuration
const uploadsDir = 'uploads/';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        // Save file with a unique name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {` `
            return cb(null, true);
        } else {
            cb('Error: File type not supported');
        }
    }
});

// Upload route
app.post('/test/upload', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, error: 'File too large. Max size is 5 MB.' });
            }
            return res.status(500).json({ success: false, error: 'Multer error occurred during upload.' });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json({ success: false, error: 'An unknown error occurred.' });
        }
        
        // Everything went fine
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded.' });
        }
        
        console.log('Uploaded file:', req.file);
        res.json({ success: true, filePath: req.file.path });
    });
});
// Start the server on port 3000
app.listen(9000, () => {
    console.log("Listening on port 9000...");
});