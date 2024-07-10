import express from 'express';
import {registerController,loginController,testController, forgotpasswordController, updateProfileController, grtOrdersController} from '../controller/authContoller.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',registerController)

router.post('/login',loginController)

router.post('/forgot-password',forgotpasswordController)

router.get('/test',requireSignIn,isAdmin,testController)

router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

router.put('/profile',requireSignIn,updateProfileController)

router.get('/orders',requireSignIn,grtOrdersController)

export default router