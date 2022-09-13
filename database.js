const mongoose = require('mongoose');
require('dotenv').config();

const PASS = process.env.MONGO_PASSWORD || 'no username'
const USER = process.env.MONGO_USERNAME || 'no password'
let databaseURL;

// pass = 'no password'
if (PASS === 'no password') {
  databaseURL = `mongodb://127.0.0.1:27017/`
} else {
  databaseURL = `mongodb+srv://${USER}:${PASS}@cluster0.uvx8gel.mongodb.net/test`
}

mongoose.connect(databaseURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log('mongo db connected')})
.catch((err) => {console.log('mongo failed to connect ', err)})

const appointment = new mongoose.Schema({
    doctor: String,
    patient: String,
    kind: String,
    date: String,
    time: String
});

const doctor = new mongoose.Schema({
  name: String
});

const Appointment = mongoose.model('Appointments', appointment);
const Doctor = mongoose.model('Doctors', doctor);

let helpers = {
  /*
  Helper function used to validate appointment date.
*/
  validateDate: (date) => {
    const errorMessage = `Invalid date, please check the date format again and make sure it follows the 
                        "mm/dd/yyyy" format`
    const dateSplit =  date.split('/')
    try {
      if (dateSplit.length !== 3 ) { throw new Error}
      const [month, day, year] = dateSplit
      if (parseInt(month) < 1 || parseInt(month) > 12) { throw new Error }
      if (parseInt(day) < 1 || parseInt(day) > 31) { throw new Error }
    } catch(error) {
      throw new Error(errorMessage)
    }

  },

  /*
    Helper function used to validate appointment time.
  */
  validateTime: (time) => {
    const errorMessage = `Invalid time, please check the time format again and make sure it follows the "hh:mm" 
                        format, is in militarty time. I.G. 18:30 -> 6:30pm, and is in a 15 minute interval I.G
                        08:15, 12:30`
    const timeSplit =  time.split(':')
    try {
      if (timeSplit.length !== 2 ) { throw new Error }
      const [hour, minute] = timeSplit
      if (parseInt(hour) > 24) { throw new Error }
      if (parseInt(minute) > 60 || parseInt(minute) % 15 !== 0) {  throw new Error }
    } catch (error) {
      throw new Error(errorMessage)
    }
  },
  /*
    Helper function used to validate appointment details.
  */
  validateAppointmentDetails: (details) => {
    const requiredDetails = ['doctor', 'patient', 'kind', 'date', 'time']
    for (var requiredDetail of requiredDetails) {
      if (!details[requiredDetail]) {
        throw new Error(`${requiredDetails} is required to make an appointment`) 
      }
    }
  },
}

let database = {
  appointments:{
    /*
      Takes a hash containing some or all of the appointment details and returns an array containing
      the apppointments that match the criteria.
    */
    getAppointment: async (details) => {
      try {
        return await Appointment.find(details)
      } catch(error) {
        console.log('failed to retrieve appointment(s)', error)
      }
    },

    /*
      Takes a hash containing all appointment details. Note, if an appointment detail id missing
      such as a doctors name or patients name the appointment will not be created and an error will 
      be raised.
    */
    createAppointment: async (details) => {
      try {
        helpers.validateAppointmentDetails(details)
        helpers.validateTime(details.time)
        helpers.validateDate(details.date)
        const doctor = await Doctor.find({name: details.doctor})
        if (doctor.length < 1) { throw new Error(`doctor ${details.doctor} is not in the database`)}
        const doctorAppointmentsAtTime = await Appointment.find({date: details.date, time: details.time})
        if (doctorAppointmentsAtTime.length >= 3) {
          throw new Error(`${details.doctor} already has three appointments scheduled for this time`) 
        }
        await new Appointment(details).save()
        console.log(`appointment created successfully`)
      } catch(error) {
        throw new Error(error)
      }
    },

    /*
      Takes hash containing all of the details to delete of an appointment to delete.
    */
    deleteAppointment: async (details) => {
      try {
        helpers.validateAppointmentDetails(details)
        helpers.validateTime(details.time)
        helpers.validateDate(details.date)
        await Appointment.findOneAndRemove(details)
        console.log(`successfully deleted appointment`)
      } catch(error) {
        throw new Error(`failed to cancel appointment ${error}`)
      }
    },
  },
  doctors : {
    /*
      Takes an array of hashes containing doctor names. Ig. {name: 'name'}.
    */
      getDoctor: async ({names}) => {
      try {
        if (!names.length < 1) {
          return await Doctor.find()
        } else {
          const doctors = []
          for (var name of names) {
            const doctor = await Doctor.find({name: name})
            doctors.push(doctor)
          }
          return doctors
        }
      } catch(error) {
        throw new Error(`failed to get doctors(s) ${error}`)
      }
    },
    /*
      Takes a hash containing doctors name. Ig. {name: 'name'}.
    */
      addDoctor: async (doctor) => {
      try {
        await new Doctor(doctor).save()
          console.log(`doctor ${doctor.name} has been added`)
        } catch(error) {
          throw new Error(`failed to add doctor ${error}`)
      }
    },
    /*  
      Takes a hash containing doctors name. Ig. {name: 'name'}. Throws an error if the 
      doctor has scheduled appointments that need to be cancelled or rescheduled first.
    */
    removeDoctor: async(doctor) => {
      
      try {
        if (!doctor.name) {throw new Error('No doctor for removal was specified')}
        const DoctorsAppointments = await appointments.find({doctor: doctor.name})
        if (DoctorsAppointments.length > 0) {
          throw new Error('Doctor cannot be removed as they still have scheduled appointments');
        }
        await Doctor.findOneAndRemove(doctor)
        console.log(`doctor ${doctor.name} has been removed`)
        } catch(error) {
          throw new Error(`failed to remove doctor ${error}`)
      }
    }
  }
}

 module.exports = {
  database : database
}


