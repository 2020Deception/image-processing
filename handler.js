'use strict'
const Tesseract = require('tesseract.js')
const express = require('express')
const bodyParser = require('body-parser')
const endpoint = "/image"
const path = require('path')
const app = express()
const port = 8080
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const multiparty = require('multiparty');
const http = require('http');
const util = require('util');
const fs = require('fs');

app.post(endpoint, function (req, res){
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    console.log('files', files);
    console.log('starting file read');
    var img = fs.readFileSync(files.image[0].path);
    fs.readFile(files.image[0].path, function (err, data) {
      console.log('ending file read');
      read(data, function(error, result) {
        console.log('error', error, 'result', result);
        res.writeHead(200, {'Content-Type': 'text/plain' });
        res.end(result);
      });
    });
  })
})


const read = (image, callback) => {
  Tesseract.recognize(image, {
    lang: 'eng'
  })
  .progress(function(p) {
    console.log('progress', p)
  })
  .then(function(r) {
    console.log('result', r)
    // callback(null, result)
  })
  .catch(function(e) {
    console.log('error', e)
    callback(e)
  })
  .finally(function(f) {
    console.log('finally', f.text)
    callback(null, f.text)
  })
}

app.listen(port)

// http.createServer(function(req, res) {
//
//   if (req.url === endpoint && req.method === 'POST') {
//     // parse a file upload
//     var form = new multiparty.Form();
//
//     form.parse(req, function(err, fields, files) {
//       console.log('files', files);
//
//       var img = fs.readFileSync(files.image[0].path);
//
//       read(img, function(error, result) {
//         console.log('error', error, 'result', result);
//         res.writeHead(200, {'content-type': 'text/plain'});
//         res.write('received upload:\n\n');
//         res.end(util.inspect({fields: fields, files: files}));
//       });
//     })
//
//     return;
//   }
//
//   // show a file upload form
//   res.writeHead(200, {'content-type': 'text/html'});
//   res.end(
//     '<form action="/upload" enctype="multipart/form-data" method="post">'+
//     '<input type="text" name="title"><br>'+
//     '<input type="file" name="upload" multiple="multiple"><br>'+
//     '<input type="submit" value="Upload">'+
//     '</form>'
//   );
// }).listen(8080);
