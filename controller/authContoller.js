import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
export const registerController = async (req,res) =>{
  try{
     const {name,email,password,phone,address,answer} = req.body;
     if(!name){
        return res.send({message:"name is required"})
     }
     if(!answer){
        return res.send({message:"answer is required"})
     }
     if(!email){
        return res.send({message:"email is required"})
     }
     if(!password){
        return res.send({message:"password is required"})
     }
     if(!phone){
        return res.send({message:"phone is required"})
     }
     if(!address){
        return res.send({message:"address is required"})
     }

     const existingUser = await userModel.findOne({email})

     if(existingUser){
        return res.status(200).json({
            success:false,
            message:"already user existing,please login"
        })
     }

     const hashedPassword = await hashPassword(password)

     const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()

     res.status(201).send({
        success:true,
        message:"user register successfully",
        user
     })
  }
  catch(err){
    console.log(err)
    res.status(500).json({
        success:false,
        message:"error in register",
        err
    })
  }
}

//LOGIN KE LIYE 
export const loginController = async (req,res) =>{
    try{
       const {email,password} = req.body

       if(!email || !password){
        return res.status(404).send({
            success:false,
            message:"invalid password or email"
        })
       }
       const user = await userModel.findOne({email})

       if(!user){
        return res.status(404).send({
            success:false,
            message:"email is not register"
        })
       }
       const match = await comparePassword(password,user.password)
       if(!match){
        return res.status(200).send({
            success:false,
            message:"invalid password"
        })
       }

       const token =  await jwt.sign({_id:user._id},process.env.JWT_SECRET,
        {'expiresIn':"7d"});
        res.status(200).send({
            success:true,
            message:"login successfully",
            token,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error in login",
            err
        })
    }
}

//test controller

export const testController = (req,res) =>{
    res.send("protected route")
}

export const forgotpasswordController = async (req,res) => {
    try{
       const {email,answer,newPassword} = req.body;
       if(!email){
        res.status(400).send({message:"email is required"})
       }
       if(!answer){
        res.status(400).send({message:"answer is required"})
       }
       if(!newPassword){
        res.status(400).send({message:"new password is required"})
       }
       //check 
       const user = await userModel.findOne({email,answer})
       //validation
       if(!user){
        return res.status(404).send({
            success:false,
            message:"wrong email or answer"
        })
       }
       const hashed = await hashedPassword(newPassword)
       await userModel.findByIdAndUpdate(user._id,{password:hashed})
       res.status(200).send({
        success:true,
        message:"password reset successfully"
       })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"something went wrong",
            err
        })
    }
}

export const updateProfileController = async(req,res)=>{
    try{
        const {name,email,password,address,phone} = req.body
        const user = await userModel.findById(req.user._id)
        if(password && password.length<6){
            return res.json({error:"password is required and 6 character long"})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password: hashPassword || user.password,
            phone:phone || user.phone,
            address:address||user.address

        },{new:true})
        res.status(200).send({
            success:true,
            message:"profile updated successfully",
            updatedUser
        })
    }
    catch(err){
        console.log(err)
        res.status(400).send({
            success:false,
            err,
            message:"error while update profile"
        })
    }
}

export const grtOrdersController = async(req,res)=>{
    try{
           const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
           res.json(orders)
    }
    catch(err){
      console.log(err)
      res.status(500).send({
        success:false,
        err,
        message:"error while getting orders"
      })
    }
}