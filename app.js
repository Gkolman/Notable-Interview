const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname + '/client/dist')))
var cors = require("cors");
app.use(cors());
const database = require('./database.js').table

app.use('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// app.get('/', function (req, res) {

//     res.write(__dirname + '/../client/dist')
//     res.end()
// });

// app.get('/', function(req, res){
//     res.sendFile(path.resolve(__dirname+ '/../client/dist/index.html')); // change the path to your index.html
// });

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
})