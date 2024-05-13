import mongoose from "mongoose";
const uri =
  "mongodb+srv://shree:12345@cluster0.mtrgf7k.mongodb.net/DriveTest?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("********Connected to Mongodb***************");
  })
  .catch((error) => {
    console.log(error);
  });

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: "default",
  },
  lastName: {
    type: String,
    default: "default",
  },
  licenseNo: {
    type: String,
    default: "default",
  },
  age: {
    type: Number,
    default: 0,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'drivetest_appointment',
    default: null,
  },
  testType: {
    type: String,
    default: "G2",
  },
  comment: {
    type: String,
    default: "N/A",
  },
  isPassed: {
    type: Boolean,
    default: false,
  },
  carDetails: {
    make: {
      type: String,
      default: "default",
    },
    model: {
      type: String,
      default: "default",
    },
    year: {
      type: String,
      default: "0",
    },
    platNo: {
      type: String,
      default: "default",
    },
  },
});

const userModel = mongoose.model("drivetest_user", userSchema);
export default userModel;
