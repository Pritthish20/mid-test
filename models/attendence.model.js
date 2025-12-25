import mongoose, { mongo } from "mongoose";

const attendenceSchema = new mongoose.Schema({
    classId: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    StudentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type:String,
        enum:["present","absent"],
        required:true,
    }

},{timestamps:true});

const Attendence = mongoose.model("Attendence", attendenceSchema);
export default Attendence