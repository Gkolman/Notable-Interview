const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const JSON = require('json')
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname + '/client/dist')))
var cors = require("cors");
app.use(cors());
const database = require('./database.js').database

app.use('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

/*
  takes a hash of {names: [name1, name2]} as the request body to get a list of doctors
  if no list is provided all doctors will be retreived.
*/
app.get('/doctors', (req, res) => {
  let body = JSON.stringify(req.body || {})
    database.doctors.getDoctor(JSON.parse(body))
    .then((doctors) => {
      res.status(200).send(doctors)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

/*
  takes a hash of {name: name} as the request body to add a new doctor.
*/
app.post('/doctors', (req, res) => {
  let body = JSON.stringify(req.body || {})
  database.doctors.addDoctor(JSON.parse(body))
  .then(() => {
    res.status(200).end()
  })
  .catch((error) => {
    res.status(500).send(error)
  })
})

/*
  takes a hash of {name: name} as the request body to remove a new doctor.
*/
app.delete('/doctors', (req, res) => {
  let = JSON.stringify(req.body)
  database.doctors.removeDoctor(JSON.parse(body))
  .then(() => {
    res.status(200).end()
  })
  .catch((error) => {
    res.status(500).send(error)
  })
})

/*
  takes a hash containing the properties of the appointments you wish to retreive
  Ig {doctor: 'name', patient: 'name': date: 'dd/mm/yyyy', time: 'hh:mm', kind: 'kind' }.
*/
app.get('/appointments', (req, res) => {
  let body = JSON.stringify(req.body || {})
  database.appointments.getAppointment(JSON.parse(body))
  .then((appointments) => {
    res.status(200).send(appointments)
  })
  .catch((error) => {
    res.status(500).send(error)
  })
})

/*
  takes a hash containing the properties of the appointments you wish to create
  Ig {doctor: 'name', patient: 'name': date: 'dd/mm/yyyy', time: 'hh:mm', kind: 'kind' }.
*/
app.post('appointments', (req, res) => {
  let body = JSON.stringify(req.body || {})
  database.appointments.createAppointment(JSON.parse(body))
    .then(() => {
      res.status(200).end()
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

/*
  takes a hash containing the properties of the appointments you wish to delete. Note all information
  is required.Ig {doctor: 'name', patient: 'name': date: 'dd/mm/yyyy', time: 'hh:mm', kind: 'kind' }
  in order to prevent deleting multiple records.
*/
app.delete('/appointments', (req, res) => {
  let body = JSON.stringify(req.body)
  database.appointments.createAppointment(JSON.parse(body))
  .then(() => {
    res.status(200).end()
  })
  .catch((error) => {
    res.status(500).send(error)
  })
})

app.listen(port, () => {
    console.log('Server started at http://localhost:' + port);
})