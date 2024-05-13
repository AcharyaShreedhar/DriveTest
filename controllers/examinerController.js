import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";

class examinerController {
  static appointment_get_controller = async (req, res) => {
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

      res.render("examiner.ejs", {
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
  static driver_detail_controller = async (req, res) => {
    const isAdmin = req.isAdmin;
    const isAuthenticated = req.isAuthenticated;
    const isExaminer = req.isExaminer;
    const username = req.query.name;
    const userUpdateSuccess = req.session.userUpdateSuccess;
    if (userUpdateSuccess) {
      delete req.session.userUpdateSuccess; // Clear the flag after showing the toast
    }

    try {
      const driver = await userModel.findOne({ username: username }).exec();
      if (driver) {
        let appointmentInfo = null;
        if (driver.appointmentId && driver.appointmentId != "") {
          appointmentInfo = await appointmentModel
            .findOne({ _id: driver.appointmentId })
            .exec();
        }

        res.render("driverDetail", {
          driverData: driver,
          appointmentInfo: appointmentInfo,
          isAuthenticated,
          isAdmin,
          isExaminer,
          userUpdateSuccess,
        });
      } else {
        const message = "No Driver Found";
        res.render("driverDetails", { driverData: message, isAuthenticated });
      }
    } catch (error) {
      res.render("driverDetails", {
        driverData: null,
        isAuthenticated,
        isAdmin,
        isExaminer,
        userUpdateSuccess,
      });
    }
  };

  static update_result_controller = async (req, res) => {
    const { grade, comment } = req.body;

    const username = req.params.username;

    let result = false;
    if (grade == "Pass") {
      result = true;
    } else {
      result = false;
    }
    const isAuthenticated = req.isAuthenticated;
    const isAdmin = req.isAdmin;
    const isExaminer = req.isExaminer;
    const userUpdateSuccess = req.session.userUpdateSuccess;
    if (userUpdateSuccess) {
      delete req.session.userUpdateSuccess; // Clear the flag after showing the toast
    }

    userModel
      .findOneAndUpdate(
        { username: username },
        {
          $set: {
            isPassed: result,
            comment: comment,
          },
        },
        { upsert: false }
      )
      .then(() => {
        res.redirect("/examiner");
      })
      .catch((error) => {
        req.session.carInfoUpdateFailure = true;
        console.log(error);
      });
  };
}

export default examinerController;
