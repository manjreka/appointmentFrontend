const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const user = require('./models/user')
const userAppoint = require('./models/userAppoint')

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.listen(3080, () => {
    console.log('server successfully connected to port 3080!!')
})

const SECRETE_KEY = 'fnhebfjrefhuerfgrgrgfdver'

const database = 'mongodb+srv://ashwarya:ashwarya@cluster0.rjiv1wr.mongodb.net/Book_Appointments?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(database)
    .then(() => {
        console.log('database connected successfully!!')
    })
    .catch((err) => {
        console.log('error while connecting to database', err)
    })

app.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body
        console.log(req.body)
        const oldUser = await user.findOne({ email })
        console.log(`olduser: ${oldUser}`)
        if (oldUser) {
            return res.status(400).json({ message: 'email already in use' })
        }
        const hasedPassword = await bcrypt.hash(password, 10)
        const hasedConfirmPassword = await bcrypt.hash(confirmPassword, 10)
        const newUser = new user({ email, password: hasedPassword, confirmPassword: hasedConfirmPassword })

        console.log(`newUser: ${newUser}`)

        if (password !== confirmPassword) {

            return res.status(401).json({ message: 'password not matching confirm password' })

        }

        await newUser.save()
        res.status(201).json({ message: 'user created sccessfully!!' })

    }
    catch (err) {
        res.status(500).json({ error: "error while signing up !!", err })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userInfo = await user.findOne({ email })
        console.log(userInfo)

        if (!userInfo) {
            return res.status(400).json('Kindly register to login!!')
        }

        const passwordValidation = await bcrypt.compare(password, userInfo.password)
        console.log(passwordValidation)

        if (!passwordValidation) {
            return res.status(400).json({ message: 'inValid Password' })
        }

        const token = jwt.sign({ USERID: userInfo._id }, SECRETE_KEY, { expiresIn: '15hr' })


        return res.status(200).json({ message: 'Login Successfull!!', token })
    }
    catch (err) {
        return res.status(500).json({ message: 'Err while logging in', err })
    }
})

app.post('/book_appointment', async (req, res) => {
    try {
        const { userId, date, time } = req.body
        const appointmentTaken = await userAppoint.find({ time, date  })
        console.log(appointmentTaken)
        if (appointmentTaken.length !== 0) {
            return res.status(400).json({ message: 'No slot avalaible' })
        }

        const newAppointment = new userAppoint({
            userId, date, time
        })

        console.log(newAppointment)

        await newAppointment.save()
        return res.status(200).json({ message: 'appointment booked successfully', newAppointment })
    }
    catch (err) {
        return res.status(500).json({ message: 'Err while logging in', err })
    }
})

app.get('/', async(req, res) => {
    try {
        const {date} = req.query
        console.log(date)
        const appointmentsList = await userAppoint.find({date})

        console.log(appointmentsList)
        return res.status(200).json({appointmentsList})

    }
    catch(err){
        return res.status(500).json({message: 'Err while fetching data', err})
    }
})