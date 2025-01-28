import validator from 'validator';
import bcrypt, { compareSync } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctor.model.js';
import jwt from 'jsonwebtoken';


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

export { addDoctor, loginAdmin }