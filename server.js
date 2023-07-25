const express = require('express');
const app = express();
const port = 3030;
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require('fs');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        arr = fileName.split('.');
        let newFileName = '';
        for (let i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + 'jpeg');
            }
        }
        cb(null, newFileName);
    },
});

function isJPEG(file) {
    // Check if the file is a JPEG image
    const ext = path.extname(file.originalname).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg';
}

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!isJPEG(file)) {
            // If the file is not a JPEG, then change the extension to .jpeg
            file.originalname = file.originalname.replace(
                path.extname(file.originalname),
                '.jpeg'
            );
            req.isImageChanged = true;
        } else {
            req.isImageChanged = false;
        }
        cb(null, true);
    },
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    if (req.isImageChanged) {
        res.send('File uploaded and image đã thay đổi thành JPEG');
	    //res.send(file);

    } else {
        res.send('File uploaded successfully');
 	//res.send(file);
    }
});

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 5), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send('Multiple files uploaded successfully');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.htm');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});