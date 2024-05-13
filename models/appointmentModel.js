
import mongoose from "mongoose";
const uri =
  "mongodb+srv://shree:12345@cluster0.mtrgf7k.mongodb.net/DriveTest?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
        console.log("********Connected to Mongodb***************")
    })
    .catch((error)=>{console.log(error)})

    const appointmentSchema = mongoose.Schema({
        date: {
          type: Date,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        isTimeSlotAvailable: {
          type: Boolean,
          default: true,
        },
      });


    const appointmentModel=mongoose.model("drivetest_appointment",appointmentSchema);
    export default appointmentModel;