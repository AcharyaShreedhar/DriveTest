import express from "express";
const router = express.Router();

import userController from "../controllers/userController.js";
import driverController from "../controllers/driverController.js";
import adminController from "../controllers/adminController.js";
import examinerController from "../controllers/examinerController.js";
import isAuthenticated from "../middleware/authMiddleware.js";
import appointmentModel from "../models/appointmentModel.js";
import isAdmin from "../middleware/adminMiddleware.js";
import isExaminer from "../middleware/examinerMiddleware.js";

// Route for "/home"
router.get(
  "/home",
  isAuthenticated,
  isAdmin,
  isExaminer,
  userController.home_controller
);

router.get("/login", userController.login_get_controller);
//Assuming this route handles the login form submission
router.post("/login", userController.login_post_controller);
router.get("/logout", userController.logout_controller);
router.get("/signup", userController.signup_get_controller);
router.post("/signup", userController.signup_post_controller);

router.get("/g2", isAuthenticated, driverController.g2_get_controller);
router.post(
  "/updateUserInfo",
  isAuthenticated,
  driverController.update_user_info_controller
);
router.post(
  "/updateCarInfo",
  isAuthenticated,
  driverController.update_car_info_controller
);
router.get("/g", isAuthenticated, driverController.g_get_controller);

router.get("/appointment", isAdmin, adminController.appointment_get_controller);
router.post(
  "/createAppointmentSlot",
  isAdmin,
  adminController.create_appointment_slots_post_controller
);
router.post("/available-times/:date", driverController.getAvailableTimesByDate);
router.post(
  "/bookAppointmentForG2",
  isAuthenticated,
  driverController.updateAppointmentIdForG2
);
router.post(
  "/bookAppointmentForG",
  isAuthenticated,
  driverController.updateAppointmentIdForG
);
// DELETE route to handle appointment deletion
router.delete("/deleteAppointment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the appointment by its ID
    const appointmentToDelete = await appointmentModel.findById(id);

    // Check if the appointment exists
    if (!appointmentToDelete) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Delete the appointment
    await appointmentToDelete.deleteOne();

    // Send a success response
    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.log("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/examiner",
  isExaminer,
  examinerController.appointment_get_controller
);
router.get(
  "/driverDetails",
  isExaminer,
  examinerController.driver_detail_controller
);
router.post(
  "/updateResult/:username",
  isExaminer,
  examinerController.update_result_controller
);
router.get(
  "/testresults",
  isAdmin,
  isExaminer,
  adminController.testResults_get_controller
);

export default router;
