import Class from "../models/class.model.js";
import { startSession } from "../utils/globaState.js";

export const startAttendence = async (req, res) => {
  const { classId } = req.body;

  try {
    // const classDoc = await Class.findById(classId);
    // if (!classDoc) {
    //   return res.status(404).json({
    //     success: false,
    //     error: `Class not found`,
    //   });
    // }

    // const session = startSession(classId);
    // return res.status(200).json({
    //   success: true,
    //   data: {
    //     classId: session.classId,
    //     startedAt: session.startedAt,
    //   },
    // });

    const session = startSession(req.classDoc._id.toString());
    return res.status(200).json({
      success: true,
      data: {
        classId: session.classId,
        startedAt: new Date(session.startedAt).toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
