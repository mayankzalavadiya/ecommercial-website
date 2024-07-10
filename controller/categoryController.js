import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"

export const CreateCategoryController = async (req,res) =>{
   try{
      const {name} = req.body
      if(!name){
        return res.status(401).send({message:"name is required"})
      }
      const existingCategory = await categoryModel.findOne({name});
      if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"category already exists"
        })
      }
      const category = await new categoryModel({name,slug:slugify(name)}).save()
      res.status(201).send({
        success:true,
        message:"new category created",
        category
      })
   }
   catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        err,
        message:"error in category"
    })
   }
}

export const updateCategory = async (req,res)=>{
    try{
        const {name} = req.body
        const {id} = req.params
         const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
         res.status(200).send({
            success:true,
            message:"category updated successfully"
         })
    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            success:false,
            err,
            message:"err in updated category"
        })
    }
}

export const categoryController2 = async(req,res)=>{
    try{
       const category = await categoryModel.find({})
       res.status(200).send({
        success:true,
        message:"all categories list",
        category,
       })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
          success:false,
          err,
          message:"error in getting all categories"
        })
    }
}

export const singleCategory = async(req,res)=>{
    try{
      
       const category = await categoryModel.findOne({slug:req.params.slug})
       res.status(200).send({
        success:true,
        message:"get single category successfully",
        category
       })
    }
    catch(err){
       console.log(err)
       res.status(500).send({
        success:false,
        err,
        message:"error in getting single category"
       })
    }
}

export const deleteCategory=async(req,res)=>{
    try{
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"category deleted successfully"
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            message:"error in delete category"
        })
    }
}