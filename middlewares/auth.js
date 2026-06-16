const jwt =require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
require("dotenv").config();
const auth=async (req,res,next)=>{
    const token=req.headers.authorization;
    if(!token){
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }
    try{
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET_CODE
        )
        const user=await prisma.user.findUnique({
            where:{
                id: decoded.id
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
        });
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        req.user=user;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
}
module.exports = auth;