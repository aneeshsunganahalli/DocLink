import express from "express";
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, loginDoctor } from "../controllers/doctor.controller.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.post('/cancel-appointment',authDoctor, appointmentCancel)
doctorRouter.post('/complete-appointment',authDoctor, appointmentComplete)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)

export default doctorRouter