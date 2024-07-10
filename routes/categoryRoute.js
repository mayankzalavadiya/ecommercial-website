import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController2, CreateCategoryController, deleteCategory, singleCategory, updateCategory } from "../controller/categoryController.js";

const router = express.Router()

//create category
router.post('/create-category',requireSignIn,isAdmin,CreateCategoryController)

//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategory)

//get all category
router.get('/get-category',categoryController2)

//single category 
router.get('/single-category/:slug',singleCategory)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategory)

export default router