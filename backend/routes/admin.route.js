import express from "express";
import { addDoctor, adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from "../controllers/admin.controller.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailabilty } from "../controllers/doctor.controller.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors',authAdmin, allDoctors)
adminRouter.post('/change-availability',authAdmin, changeAvailabilty)
adminRouter.post('/cancel-appointment',authAdmin, appointmentCancel)
adminRouter.get('/appointments',authAdmin, appointmentsAdmin)
adminRouter.get('/dashboard',authAdmin, adminDashboard)

export default adminRouter