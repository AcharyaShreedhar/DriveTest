import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";

class adminController {
  static appointment_get_controller = async (req, res) => {
    const isAdmin = req.isAdmin;
    const isAuthenticated = req.isAuthenticated;
    const slotAlreadyExist = req.session.slotAlreadyExist;
    if (slotAlreadyExist) {
      delete req.session.slotAlreadyExist; // Clear the flag after showing the toast
    }
    const slotCreationSuccess = req.session.slotCreationSuccess;
    if (slotCreationSuccess) {
      delete req.session.slotCreationSuccess; // Clear the flag after showing the toast
    }
    const slotCreationFailure = req.session.slotCreationFailure;
    if (slotCreationFailure) {
      delete req.session.slotCreationFailure; // Clear the flag after showing the toast
    }

    try {
      // Fetch all appointments
      const allAppointments = await appointmentModel.find({});

      // Pass the appointments to the view
      res.render("appointment1.ejs", {
        isAdmin,
        isAuthenticated,
        slotAlreadyExist,
        slotCreationSuccess,
        slotCreationFailure,
        appointments: allAppointments, // Add the fetched appointments to the rendering data
      });
    } catch (error) {
      res.status(500).send("Internal Server Error"); // Handle the error appropriately
    }
  };

  static create_appointment_slots_post_controller = async (req, res) => {
    try {
      // Extract data from the request body
      const { date, appointmenttime } = req.body;

      // Check if the appointment slot already exists for the given date and time
      const existingAppointmentSlot = await appointmentModel.findOne({
        date,
        time: appointmenttime,
      });

      if (existingAppointmentSlot) {
        // The appointment slot already exists, so return an error message
        req.session.slotAlreadyExist = true;
        res.redirect("/appointment");
      }

      // Create a new appointment slot instance
      const newAppointmentSlot = new appointmentModel({
        date,
        time: appointmenttime,
        isTimeSlotAvailable: true,
      });

      // Save the appointment slot to the database
      await newAppointmentSlot.save();

      req.session.slotCreationSuccess = true;
      res.redirect("/appointment");
    } catch (error) {
      // Handle any errors that occurred during the process
      console.log(error);
    }
  };

  static testResults_get_controller = async (req, res) => {
    const isAdmin = req.isAdmin;
    const isAuthenticated = req.isAuthenticated;
    const isExaminer = req.isExaminer;

    try {
      // Fetch all drivers along with their associated appointments
      const drivers = await userModel
        .find({
          userType: "Driver",
        })
        .populate({
          path: "appointmentId",
          select: "date time",
          model: "drivetest_appointment",
        });

      res.render("testresults.ejs", {
        isAdmin,
        isAuthenticated,
        isExaminer,
        drivers: JSON.stringify(drivers), // Pass the formatted data to the view
      });
    } catch (error) {
      // Handle error appropriately
      res.status(500).send("Internal server error");
    }
  };
}

export default adminController;
