import Class from "../models/class.model"

export const requiredRole = (...roles) => async(req,res,next)=> {
    
    if(!req.user){
        return res.status(401).json({
            success:false,
            error:"Unauthorized, token missing or invalid"
        })
    }
    
    if(!roles.includes(req.user.role)){
        return res.status(403).json({
            success:false,
            error: "Forbidden"
        })
    }
    next();
}

export const roleTeacher = async(req,res,next)=>{

    if(!req.user){
        return res.status(401).json({
            success:false,
            error:"Unauthorized, token missing or invalid"
        })
    }
    
    if(req.user.role==="teacher"){
        return res.status(403).json({
            success:false,
            error: "Forbidden, teacher access required"
        })
    }
    next();
}

export const classTeacher =(classId)=>async(req,res,next)=>{

    // if(!req.user){
    //     return res.status(401).json({
    //         success:false,
    //         error:"Unauthorized, token missing or invalid"
    //     })
    // }
    
    // if(req.user.role==="teacher"){
    //     return res.status(403).json({
    //         success:false,
    //         "error": "Forbidden, teacher access required"
    //     })
    // }

    const classDoc= await Class.findOne(classId)
    
    if(classDoc.teacherId !== req.user._id){
        res.status(403).json({
            success: false,
            error: "Forbidden, not class teacher"
        })
    }
    next();
}