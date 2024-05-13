const isExaminer = (req, res, next) => {
  // Your authentication logic here to check if the user is authenticated
  // For this example, let's assume you have a property called `user` in the `req.session` object when a user is authenticated.
  if (req.session && req.session.userType === "Examiner") {
    // User is authenticated, set the variable to true
    req.isExaminer = true;
  } else {
    // User is not authenticated, set the variable to false
    req.isExaminer = false;
  }
  // Continue to the next middleware/route handler
  next();
};

export default isExaminer;
