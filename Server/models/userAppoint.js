const mongoose = require('mongoose')

const userAppointmentSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    companyName: {type: String, required: true},
    email: {type: String, required: true},
    name: {type: String, required: true}
}, 
{timestamps: true}
)

// timestamp will automaticaaly add created at and updated at field 

const userAppointment = mongoose.model('userAppointment', userAppointmentSchema) 

module.exports = userAppointment