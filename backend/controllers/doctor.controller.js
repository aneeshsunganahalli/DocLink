import doctorModel from "../models/doctor.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointment.model.js"

const changeAvailabilty = async (req,res) => {
  try {
    
    const {docId} = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
    res.json({success:true, message: "Availabilty Changed"})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const doctorList = async (req,res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password','-email'])
    res.json({success:true,doctors})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API for Doctor Login
const loginDoctor = async (req,res) => {
  try {
    const {email,password} = req.body
    const doctor = await doctorModel.findOne({email})

    if(!doctor) {
      return res.json({success:false,message:"Invalid Credentials"})
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (isMatch) {
      const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)

      res.json({success:true, token})
    } else {
      return res.json({success:false,message:"Invalid Credentials"})
    }

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to get doctor appointments
const appointmentsDoctor = async (req,res) => {
  try {
    const {docId} = req.body
    const appointments = await appointmentModel.find({docId})

    res.json({success:true,appointments})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to mark completed appointments
const appointmentComplete = async (req,res) => {
  try {
    const {docId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId) {
      
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted: true})
      return res.json({success:true,message:"Appointment Completed"})
    } else {
      return res.json({succes:false,message:"Mark Failed"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to cancel appointments in Doc Panel
const appointmentCancel = async (req,res) => {
  try {
    const {docId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId) {
      
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled: true})
      return res.json({success:true,message:"Appointment Cancelled"})
    } else {
      return res.json({succes:false,message:"Cancellation Failed"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to get dashboard data for Doc Panel
const doctorDashboard = async (req,res) => {
  try {
    const {docId} = req.body
    const appointments = await appointmentModel.find({docId})

    let patients = []

    appointments.map((item) => {
      if (!patients.includes(item.userId)){
        patients.push(item.userId)
      }
    })

    const dashData = {
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true, dashData})

  
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to get Doc Profile for Doc Panel
const doctorProfile = async (req,res) => {
  try {
    const {docId} = req.body
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({success:true,profileData})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to edit Doc Profile
const  updateDoctorProfile = async (req,res) => {
  try {
    const { docId, fees, address, available } = req.body
  
    await doctorModel.findByIdAndUpdate(docId, {fees, address, available})

    res.json({success:true,message:"Profile Updated"})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
export {changeAvailabilty, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, updateDoctorProfile, doctorProfile}