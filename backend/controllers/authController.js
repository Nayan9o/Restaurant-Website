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

//login user
export const loginUser= async(req,res)=>{
  try{
    const {email,password} = req.body;
    if(!email || !password){
      return res.json({message:"Please fill all the fields", success:false});
    }
    const user=await User.findOne({email});
    if(!user){
      return res.json({message:"User not exist", success:false});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.json({message:"Invalid Creadentials", success:false});
    }  
    generateToken(res,{id:user._id,role:user.isAdmin?'Admin':'user'})
     res.json({message:"Login Successfuly", success:true,
      user:{
        name:user.name,
        email:user.email 
      }
     });

  }catch(error){
    console.log(error.message);
    return res.json({message:"Internal server error", success:false})
  }
}

//login admin
export const adminLogin= async(req,res)=>{
  try{
    const {email,password}= req.body;
    if(!email || !password){
      return res.json({message:"Please fill all the fields", success:false});
    }
    const adminEmail=process.env.ADMIN_EMAIL;
    const adminPassword=process.env.ADMIN_PASSWORD;

    if(email !== adminEmail || password !== adminPassword){
     return res.json({message:"Invalid credentials", success:false});

    }

    const token=jwt.sign({email},process.env.JWT_SECRET,{
      expiresIn:"1d"
    })

    res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:24*60*60*1000
  });
  return res.json({message:"Login successfuly",success:true})

  }catch(error){
    console.log(error.message);
    return res.json({message:"Internal server Error",success:false})
  }
}

//logout user
export const logoutUser=async(req,res)=>{
  try{
    res.clearCookie("token");
    return res.json({message:"User Logged out successfuly",success:true})
  }
  catch(error){
    console.log(error.message)
    return res.json({message:"Internal server error",success:false})
  }
}

export const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({
        message: "Invalid user",
        success: false,
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User Not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};