import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//JWT generate

const generateToken=async(res,payload)=>{
  const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"})
  res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:24*60*60*1000
  });
  return token;
}

//register user

export const registerUser = async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(!name || !email || ! password){
      return res.json({message:"Plese fill all the field",success:false})
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.json({message:"User already exists",success:false})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const user= await User.create({name,email,password:hashedPassword});

    return res.json({message:"User registered Successfully",success:true})

  }
  catch(error){
    console.log(error.message);
    return res.json({message:"Internal server error", success:false})
  }
}