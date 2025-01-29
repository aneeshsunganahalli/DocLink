import validator from 'validator';
import bcrypt, { compareSync } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctor.model.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointment.model.js';
import userModel from '../models/user.model.js';


const addDoctor = async (req, res) => {
  try {

    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file
    console.log(imageFile)

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: "Missing Details" })
    }

    // Email Format Validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" })
    }

    //Strong Password Validator
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" })
    }
    //Hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Image Upload
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
    const imageUrl = imageUpload.secure_url

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({ success: true, message: "Doctor Added" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//API for Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })

    } else {
      res.json({ success: false, message: "Invalid Credentials" })
    }

  } catch (error) {

  }
}

//API to get all doctors for admin
const allDoctors = async(req,res) => {
  try {

    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})

  } catch(error) {

    console.log(error)
    res.json({success:false,message:error.message})

  }
}

//API to get all appointment
const appointmentsAdmin = async (req,res) => {
  try {

    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API for Cancelling Appointment
const appointmentCancel = async (req,res) => {
  try {
    const {appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    //Releasing a Slot
    const {docId, slotDate, slotTime} = appointmentData

    const doctorData = await doctorModel.findById(docId)

    if (!doctorData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success:true,message:"Appointment Cancelled"})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to get Dashboard for Admin
const adminDashboard = async (req,res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }