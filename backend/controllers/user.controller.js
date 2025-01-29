import validator from 'validator'
import bcrypt, { hash } from 'bcrypt'
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctor.model.js'
import appointmentModel from '../models/appointment.model.js'
import razorpay from 'razorpay'

//API to register the user

const registerUser = async (req,res) => {
  try {

    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.json({success:false, message:"Missing Details"})
    }

    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Enter a valid email"})
    }

    if (password.length < 8) {
      return res.json({success:false, message:"Enter a strong password"})
    }

    //Hashing User Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const userData = {
      name,
      email,
      password: hashedPassword,
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

    res.json({success:true, token})
    

  } catch (error) {

      console.log(error)
      res.json({success:true,message:error.message})

  }
}


//API for user login
const loginUser = async (req,res) => {
  try {
    const {email,password} = req.body
    const user = await userModel.findOne({email})

    if(!user){
      return res.json({success:false,message:"User does not exist"})
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(isMatch) {
      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
      res.json({success:true,token})
    } else {
      res.json({success:false,message:"Invalid Credentials"})
    }

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//API to get User Profile
const getProfile = async (req,res) => {
  try {
    
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')
    
    res.json({success:true, userData})

  } catch (error) {
    console.log(error)
    res.json({success:true,message:error.message})
  }
}


//API to update profile
const updateProfile = async (req,res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({success:false,message:"Missing Data"})
    }

    await userModel.findByIdAndUpdate(userId, {name,phone,address:JSON.parse(address),dob,gender})

    if(imageFile){
      //Image Upload
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageUrl = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId,{image:imageUrl})
    }

    res.json({success:true,message:"Profile Updated"})
  } catch (error) {
    console.log(error)
    res.json({success:true,message:error.message})
  }
}

//API to book appointment
const bookAppointment = async (req,res) => {
  try {
    const {userId, docId, slotDate, slotTime} = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({success:false,message:"Doctor Unavailable"})
    }

    let slots_booked = docData.slots_booked
    //Checking Slot Availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({success:false,message:"Slot Unavailable"})
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    
    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    //Save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success:true,message:"Appointment Booked"})
  } catch (error) {
    console.log(error)
    res.json({success:true,message:error.message})
  }
}

//API to get User Appointments
const listAppointment= async (req,res) => {
  try {
    const {userId} = req.body
    const appointments = await appointmentModel.find({userId})

    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
    res.json({success:true,message:error.message})
  }
}

//API to cancel appointment
const cancelAppointment = async (req,res) => {
  try {
    const {userId, appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    //Verify Appointment
    if (appointmentData.userId !== userId) {
      return res.json({success:false, message: "Unauthorized Action"})
    }

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

//API to make payment using razorpay
/* const paymentRazorpay  = new razorpay({
  key_id:'',
  key_secret:''
}) */

export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment}