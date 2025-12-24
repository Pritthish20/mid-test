import jwt from 'jsonwebtoken'
import { env } from '../configs/envSchema.js';
import User from "../models/user.model.js"

export const authenticate = async(req,res,next)=>{
    const authHeader= req?.headers?.authorization

    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).json({
            success: false,
            error: "Unauthorized, token missing or invalid"
        })
    }

    const token = authHeader.split(" ")[1];

        try {
            const decode = jwt.verify(token,env.JWT_SECRET);
            req.user=await User.findById(decode.userId).select("role");
            next();
        } catch (error) {
            return res.status(401).json({
                    success: false,
                    error: "Unauthorized, token missing or invalid"
                })
        }
}
