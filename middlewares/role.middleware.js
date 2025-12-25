import Class from "../models/class.model.js";

export const requiredRole =
  (...roles) =>
  async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized, token missing or invalid",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
      });
    }
    next();
  };

export const roleTeacher = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  if (req.user.role === "student") {
    return res.status(403).json({
      success: false,
      error: "Forbidden, teacher access required",
    });
  }
  next();
};

export const roleStudent = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  if (req.user.role === "teacher") {
    return res.status(403).json({
      success: false,
      error: "Forbidden, student access required",
    });
  }
  next();
};

export const classTeacher = async (req, res, next) => {
  const { id } = req.params;
  const classId = id;
  try {
    const classDoc = await Class.findOne({ _id: classId });

    if (!classDoc.teacherId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden, not class teacher",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Forbidden, Internal Error : ${error}`,
    });
  }
};

export const classAccess = async(req,res,next)=>{
  const{id}=req.params;
  const classId = id;
  const userId = req.user._id

  try {
    const classDoc = await Class.findById(classId);

    if(!classDoc){
        return res.status(404).json({
          success:false,
          error:"Class not found"
        })
      }

    const isTeacher= classDoc?.teacherId.equals(userId);

    const isStudent= classDoc.studentIds.some((id)=> id.equals(userId));

    if(!isTeacher && !isStudent){
      return res.status(403).json({
        success:false,
        error:'Forbidden, Class access needed'
      })
    }

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Forbidden, Internal Error : ${error}`,
    });
  }
}
