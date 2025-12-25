import Class from "../models/class.model.js";
import Attendence from "../models/attendence.model.js"

export const createClass = async (req, res) => {
  const { className } = req.body;

  try {
    const existingClass = await Class.findOne({ className });
    if (existingClass) {
      return res.status(400).json({
        success: false,
        error: "Class already exists",
      });
    }

    const newClass = new Class({
      className,
      teacherId: req.user._id,
    });

    await newClass.save();

    return res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Creating Class Failed, Error mesage: ${error}`,
    });
  }
};

export const addStudent = async (req, res) => {
  const { studentId } = req.body;
  const { id } = req.params;

  try {
    const classDoc = await Class.findOne({ _id: id });

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    const alreadyExists = classDoc.studentIds.some(
      (id) => id.toString() === studentId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        error: "Student already exists in class",
      });
    }

    classDoc?.studentIds.push(studentId);
    await classDoc.save();

    return res.status(200).json({
      success: true,
      data: classDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Adding Student Failed, Error mesage: ${error}`,
    });
  }
};

export const getClass = async (req, res) => {
  const { id } = req.params;
  const classId = id;

  try {
    const classDoc = await Class.findById(classId)
      .populate({ path: "teacherId", select: "name email" })
      .populate({ path: "studentIds", select: "name email" });

      if(!classDoc){
        return res.status(404).json({
          success:false,
          error:"Class not found"
        })
      }

      const data ={
        _id:classDoc._id,
        className: classDoc.className,
        teacher: classDoc?.teacherId,
        student:classDoc?.studentIds,
      }

      return res.status(200).json({
        success:true,
        data,
      })
  } catch (error) {
    return res.status(500).json({
      success:false,
      error: `Getting Class Failed, Error mesage: ${error}`,
    })
  }
};

export const getMyAttendence=async(req,res)=>{
  const{id:classId} =req.params;
  const studentId = req.user._id;

  try {
    const attendenceDocs = await Attendence.find({studentId,classId}).select("classId status -_id")

    if(!attendenceDocs){
      return res.status(404).json({
        success:false,
        error:"Attendance Data not found"
      })
    }

    return res.status(200).json({
      success:true,
      data:attendenceDocs
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      error: `Getting Attedance data failed, Error mesage: ${error}`,
    })
  }
}
