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

attendenceSchema.index({ classId: 1, studentId: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendenceSchema);

export default Attendance