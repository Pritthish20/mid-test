import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
    },
    teacherId: {
      Type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    studentIds: [
      {
        Type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);


const Class=mongoose.model("Class",classSchema)

export default Class;