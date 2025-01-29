import validator from 'validator'
import bcrypt, { hash } from 'bcrypt'
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'

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
  } catch (error) {
    
  }
}

export {registerUser, loginUser}