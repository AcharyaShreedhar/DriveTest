import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";

class driverController {
  static g2_get_controller = async (req, res) => {
    const isAuthenticated = req.isAuthenticated;
    const isAdmin = req.isAdmin;
    const username = req.session.saved_name;
    const appointmentBookingSuccess = req.session.appointmentBookingSuccess;
    const userUpdateSuccess = req.session.userUpdateSuccess;
    if (userUpdateSuccess) {
      delete req.session.userUpdateSuccess; // Clear the flag after showing the toast
    }
    if (appointmentBookingSuccess) {
      delete req.session.appointmentBookingSuccess; // Clear the flag after showing the toast
    }

    try {
      const user = await userModel.findOne({ username: username }).exec();
      if (user) {
        let appointmentInfo = null;
        if (user.appointmentId && user.appointmentId != "") {
          appointmentInfo = await appointmentModel
            .findOne({ _id: user.appointmentId })
            .exec();
        }

        res.render("g2_test", {
          userData: user,
          appointmentInfo: appointmentInfo,
          isAuthenticated,
          isAdmin,
          userUpdateSuccess,
          appointmentBookingSuccess,
        });
      } else {
        const message = "No User Found";
        res.render("g2_test", { userData: message, isAuthenticated });
      }
    } catch (error) {
      res.render("g2_test", {
        userData: null,
        isAuthenticated,
        isAdmin,
        userUpdateSuccess,
        appointmentBookingSuccess,
      });
    }
  };

  static update_user_info_controller = async (req, res) => {
    const {
      first_name,
      last_name,
      license_number,
      age,
      make,
      model,
      year,
      plat_no,
    } = req.body;
    const username = req.session.saved_name;
    const isAuthenticated = req.isAuthenticated;
    const carInfoUpdateSuccess = req.session.carInfoUpdateSuccess;
    if (carInfoUpdateSuccess) {
      delete req.session.carInfoUpdateSuccess; // Clear the flag after showing the toast
    }
    const carInfoUpdateFailure = req.session.carInfoUpdateFailure;
    if (carInfoUpdateFailure) {
      delete req.session.carInfoUpdateFailure; // Clear the flag after showing the toast
    }
    const isAdmin = req.isAdmin;

    userModel
      .findOneAndUpdate(
        { username: username },
        {
          $set: {
            firstName: first_name,
            lastName: last_name,
            licenseNo: license_number,
            age: age,
            "carDetails.make": make,
            "carDetails.model": model,
            "carDetails.year": year,
            "carDetails.platNo": plat_no,
          },
        },
        { upsert: false }
      )
      .then(() => {
        // User information updated successfully
        userModel
          .findOne({ username: username })
          .then((updatedUser) => {
            req.session.userUpdateSuccess = true;
            const userUpdateSuccess = req.session.userUpdateSuccess;
            if (userUpdateSuccess) {
              delete req.session.userUpdateSuccess; // Clear the flag after showing the toast
            }
            res.render("g_test", {
              userData: updatedUser,
              appointmentInfo: null,
              userUpdateSuccess,
              appointmentBookingSuccess: false,
              carInfoUpdateSuccess,
              carInfoUpdateFailure,
              isAuthenticated,
              isAdmin,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  static update_car_info_controller = async (req, res) => {
    const { age, make, model, year, plat_no } = req.body;
    const username = req.session.saved_name;
    const isAuthenticated = req.isAuthenticated;
    const isAdmin = req.isAdmin;
    const userUpdateSuccess = req.session.userUpdateSuccess;
    if (userUpdateSuccess) {
      delete req.session.userUpdateSuccess; // Clear the flag after showing the toast
    }

    userModel
      .findOneAndUpdate(
        { username: username },
        {
          $set: {
            "carDetails.make": make,
            "carDetails.model": model,
            "carDetails.year": year,
            "carDetails.platNo": plat_no,
          },
        },
        { upsert: false }
      )
      .then(() => {
        // User information updated successfully
        userModel
          .findOne({ username: username })
          .then((updatedUser) => {
            req.session.carInfoUpdateSuccess = true;
            const carInfoUpdateSuccess = req.session.carInfoUpdateSuccess;
            if (carInfoUpdateSuccess) {
              delete req.session.carInfoUpdateSuccess; // Clear the flag after showing the toast
            }
            const carInfoUpdateFailure = req.session.carInfoUpdateFailure;
            if (carInfoUpdateFailure) {
              delete req.session.carInfoUpdateFailure; // Clear the flag after showing the toast
            }
            res.render("g_test", {
              userData: updatedUser,
              isAuthenticated,
              isAdmin,
              userUpdateSuccess,
              carInfoUpdateSuccess,
              carInfoUpdateFailure,
            });
          })
          .catch((error) => {
            req.session.carInfoUpdateFailure = true;
            console.log(error);
          });
      })
      .catch((error) => {
        req.session.carInfoUpdateFailure = true;
        console.log(error);
      });
  };

  static g_get_controller = async (req, res) => {
    const userUpdateSuccess = req.session.userUpdateSuccess;
    if (userUpdateSuccess) {
      delete req.session.userUpdateSuccess; // Clear the flag after showing the toast
    }
    const appointmentBookingSuccess = req.session.appointmentBookingSuccess;
    if (appointmentBookingSuccess) {
      delete req.session.appointmentBookingSuccess; // Clear the flag after showing the toast
    }
    const carInfoUpdateSuccess = req.session.carInfoUpdateSuccess;
    if (carInfoUpdateSuccess) {
      delete req.session.carInfoUpdateSuccess; // Clear the flag after showing the toast
    }
    const carInfoUpdateFailure = req.session.carInfoUpdateFailure;
    if (carInfoUpdateFailure) {
      delete req.session.carInfoUpdateFailure; // Clear the flag after showing the toast
    }
    const isAuthenticated = req.isAuthenticated;
    const isAdmin = req.isAdmin;

    const username = req.session.saved_name;
    try {
      const user = await userModel.findOne({ username: username }).exec();
      if (user) {
        let appointmentInfo = null;
        if (user.appointmentId) {
          appointmentInfo = await appointmentModel
            .findOne({ _id: user.appointmentId })
            .exec();
        }
        res.render("g_test", {
          userData: user,
          appointmentInfo: appointmentInfo,
          isAuthenticated,
          appointmentBookingSuccess,
          userUpdateSuccess,
          carInfoUpdateSuccess,
          carInfoUpdateFailure,
        });
      } else {
        //No user found
        const message = "No User Found";
        res.render("g_test", { userData: message, isAuthenticated, isAdmin });
      }
    } catch (error) {
      console.log(error);
      res.render("g_test", {
        userData: null,
        isAuthenticated,
        isAdmin,
        userUpdateSuccess,
        appointmentBookingSuccess,
      });
    }
  };
  static getAvailableTimesByDate = async (req, res) => {
    try {
      const date = req.params.date;
      // Fetch available appointment times from the database where isTimeSlotAvailable is true
      const availableTimes = await appointmentModel.find(
        { isTimeSlotAvailable: true, date },
        "time"
      );

      // Extract the time values from the result
      const availableTimeSlots = availableTimes.map(
        (appointment) => appointment
      );

      // Return the available time slots as JSON
      res.json(availableTimeSlots);
    } catch (error) {
      // Handle errors
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to fetch available appointment times." });
    }
  };

  // Controller method to update the appointment ID for a specific user
  static updateAppointmentIdForG2 = async (req, res) => {
    try {
      const { appointmentId } = req.body;

      const username = req.session.saved_name;

      // Find the user by their username in the userModel
      const user = await userModel.findOne({ username });

      if (!user) {
        // If the user is not found, return an error response
        return res.status(404).json({ error: "User not found." });
      }

      // Update the appointmentId field in the user object
      user.appointmentId = appointmentId;
      user.testType = "G2";

      // Save the updated user object back to the database
      await user.save();

      // Find the corresponding appointment in the appointment model
      const appointment = await appointmentModel.findOne({
        _id: appointmentId,
      });

      if (!appointment) {
        // If the appointment is not found, return an error response
        return res.status(404).json({ error: "Appointment not found." });
      }

      // Mark the appointment slot as unavailable (isTimeSlotAvailable = false)
      appointment.isTimeSlotAvailable = false;
      await appointment.save();
      // Return success response
      req.session.appointmentBookingSuccess = true;
      res.redirect("/g2");
      // res.json({ message: 'Appointment ID updated successfully.', user });
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the request." });
    }
  };

  // Controller method to update the appointment ID for a specific user
  static updateAppointmentIdForG = async (req, res) => {
    try {
      const { appointmentId } = req.body;

      const username = req.session.saved_name;

      // Find the user by their username in the userModel
      const user = await userModel.findOne({ username });

      if (!user) {
        // If the user is not found, return an error response
        return res.status(404).json({ error: "User not found." });
      }

      // Update the appointmentId field in the user object
      user.appointmentId = appointmentId;
      user.testType = "G";

      // Save the updated user object back to the database
      await user.save();

      // Find the corresponding appointment in the appointment model
      const appointment = await appointmentModel.findOne({
        _id: appointmentId,
      });

      if (!appointment) {
        // If the appointment is not found, return an error response
        return res.status(404).json({ error: "Appointment not found." });
      }

      // Mark the appointment slot as unavailable (isTimeSlotAvailable = false)
      appointment.isTimeSlotAvailable = false;
      await appointment.save();
      // Return success response
      req.session.appointmentBookingSuccess = true;
      res.redirect("/g");
      // res.json({ message: 'Appointment ID updated successfully.', user });
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the request." });
    }
  };
}

export default driverController;
