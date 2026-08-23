import express from "express"
import { ParticipentRegister,getTShirtSize,deleteParticipant,createTshirt,deleteTshirt } from "../Controler/registerControler.js";
import upload from "../middlewer/upload.js";
import {
  getAllRegistrations,
  getRegistrationById,
  updatePaymentStatus,
  getDashboardStats,
} from "../Controler/adminController.js";

const route=express.Router()




route.post(
  "/register",
  upload.single("paymentScreenshot"),
  ParticipentRegister
);
route.post(
  "/createTshirt",

  createTshirt
);
route.get(
  "/getTShirtSize",
 
 getTShirtSize
);
route.get(
  "/dashboard/stats",
  getDashboardStats
);


// All registrations
route.get(
  "/registrations",
  getAllRegistrations
);


// Single participant
route.get(
  "/registrations/:id",
  getRegistrationById
);


// Approve / Reject payment
route.patch(
  "/registrations/:id/payment-status",
  updatePaymentStatus
);
route.delete(
  "/delet/:id",
deleteParticipant
);
route.delete(
  "/deletshrt/:id",
deleteTshirt
);


export default route