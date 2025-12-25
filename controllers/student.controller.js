import User from "../models/user.model.js"

export const getStudents=async(req,res)=>{
    try {
        const studentDocs = await User.find({role:"student"}).select("name email")

        return res.status(200).json({
            sucess:true,
            data:studentDocs
        })
        
    } catch (error) {
        return res.status(500).json({
            success:true,
            error:`Getting students failed, Error message: ${error}`
        })
    }
} 