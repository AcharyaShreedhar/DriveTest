import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

class userController {
  static signup_get_controller = (req, res) => {
    // Check if there was a login error and display the error message
    const signUpError = req.session.signUpError;
    if (signUpError) {
      delete req.session.signUpError; // Clear the flag after showing the toast
    }
    res.render("signup.ejs", { signUpError });
  };
  static signup_post_controller = async (req, res) => {
    const form_data = req.body;
    const existing_user = await userModel.findOne({
      username: form_data.username,
    });
    if (existing_user) {
      req.session.existingUserMessage = "User Already Exist.Please Login";
      req.session.exname = existing_user.username;

      res.redirect("./login");
    } else {
      const hashed_password = await bcrypt.hash(form_data.password, 10);
      const user_to_save = new userModel({
        username: form_data.username,
        password: hashed_password,
        userType: form_data.userType,
      });
      const user_saved = await user_to_save.save();
      // Check if req.session exists before setting properties
      if (req.session) {
        req.session.saved_name = user_saved.username;
        req.session.userType = user_saved.userType;
        req.session.registrationSuccess = true;
      }
      res.redirect("/login");
    }
  };

  static home_controller = (req, res) => {
    // Check if registration was successful and display the toast message
    const loginSuccess = req.session.loginSuccess;
    if (loginSuccess) {
      delete req.session.loginSuccess; // Clear the flag after showing the toast
    }
    const isAuthenticated = req.isAuthenticated;
    const isAdmin = req.isAdmin;
    const isExaminer = req.isExaminer;

    res.render("dashboard.ejs", {
      isAuthenticated,
      isAdmin,
      isExaminer,
      loginSuccess,
    });
  };

  static login_get_controller = (req, res) => {
    const existingUser = req.session.existingUserMessage;
    if (existingUser) {
      delete req.session.existingUserMessage; // Clear the flag after showing the toast
    }
    // Check if login was successful and display the toast message
    const registrationSuccess = req.session.registrationSuccess;
    if (registrationSuccess) {
      delete req.session.registrationSuccess; // Clear the flag after showing the toast
    }

    // Check if there was a login error and display the error message
    const loginError = req.session.loginError;
    if (loginError) {
      delete req.session.loginError; // Clear the flag after showing the toast
    }

    res.render("login.ejs", { existingUser, loginError, registrationSuccess });
  };

  static login_post_controller = async (req, res) => {
    const form_data = req.body;

    const matched_user = await userModel.findOne({
      username: form_data.username,
    });

    if (!matched_user) {
      res.redirect("./signup");
    } else {
      const password_matched = await bcrypt.compare(
        form_data.password,
        matched_user.password
      );
      if (password_matched) {
        req.session.loginSuccess = true;
        req.session.saved_name = form_data.username;
        req.session.userType = matched_user.userType;
        res.redirect("./home");
      } else {
        req.session.password_error = "Please Enter a correct Password";
        req.session.password_error_user = matched_user.username;
        req.session.loginError = true;

        res.redirect("./login");
      }
    }
  };

  static logout_controller = (req, res) => {
    // Destroy the session and log the user out
    req.session.destroy((err) => {
      if (err) {
        console.log("Error while logging out:", err);
      }
      // Redirect the user to the login page after successful logout
      res.redirect("/login");
    });
  };

  static appointment_get_controller = (req, res) => {
    const isAuthenticated = req.isAuthenticated;

    res.render("appointment.ejs", { isAuthenticated });
  };
}

export default userController;
