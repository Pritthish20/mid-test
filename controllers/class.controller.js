import Class from "../models/class.model.js";
import Attendance from "../models/attendance.model.js";
import User from "../models/user.model.js";


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

    const newClass = await Class.create({
      className,
      teacherId: req.user._id,
      studentIds: [],
    });

    return res.status(201).json({
      success: true,
      data: newClass,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


export const addStudent = async (req, res) => {
  const { studentId } = req.body;
  const { id: classId } = req.params;

  try {
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ success: false, error: "Class not found" });
    }

    const student = await User.findById(studentId).select("_id role");
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const alreadyExists = classDoc.studentIds.some(
      (sid) => String(sid) === String(studentId)
    );

    if (alreadyExists) {
      return res.status(200).json({ success: true, data: classDoc });
    }

    classDoc.studentIds.push(studentId);
    await classDoc.save();

    return res.status(200).json({
      success: true,
      data: classDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getClass = async (req, res) => {
  const { id: classId } = req.params;

  try {
    const classDoc = await Class.findById(classId).populate({
      path: "studentIds",
      select: "name email",
    });

    if (!classDoc) {
      return res.status(404).json({ success: false, error: "Class not found" });
    }

    // ✅ tests expect these exact keys
    const data = {
      _id: classDoc._id,
      className: classDoc.className,
      teacherId: classDoc.teacherId,
      studentIds: classDoc.studentIds.map((s) => s._id), // ids
      students: classDoc.studentIds.map((s) => ({
        _id: s._id,
        name: s.name,
        email: s.email,
      })),
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getMyAttendence = async (req, res) => {
  const { id: classId } = req.params;
  const studentId = req.user._id;

  try {
    const attendenceDocs = await Attendance.find({ studentId, classId }).select(
      "classId status -_id"
    );

    if (!attendenceDocs) {
      return res.status(404).json({
        success: false,
        error: "Attendance Data not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: attendenceDocs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
