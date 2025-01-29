import express from "express";
import { appointmentsDoctor, doctorList, loginDoctor } from "../controllers/doctor.controller.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)

export default doctorRouter