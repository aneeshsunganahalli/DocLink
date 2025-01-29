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
export {changeAvailabilty, doctorList, loginDoctor, appointmentsDoctor}