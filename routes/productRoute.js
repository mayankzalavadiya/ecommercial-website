import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getproductController, getsingleproductController, productCategoryController, productcountController, productFilterController, productListController, productphotoController, relatedproductController, searchproductController, updateProductController } from "../controller/productController.js";
import formidable from 'express-formidable'

const router = express.Router()

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)


router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)
//get products
router.get('/get-product',getproductController)

//single get products
router.get('/get-product/:slug',getsingleproductController)

//get photo
router.get('/product-photo/:pid',productphotoController)

//delete product
router.delete('/product/:pid',deleteProductController)

//filter product
router.post('/product-filters',productFilterController)

//product count 
router.get('/product-count',productcountController)

//product per page
router.get('/product-list/:page',productListController)

//search product
router.get('/search/:keyword',searchproductController)

//similar product
router.get('/related-product/:pid/:cid',relatedproductController)

//category wise product
router.get('/product-category/:slug',productCategoryController)

// //payments routes
// router.get('/braintree/token',braintreeTreeToken)

// //payments
// router.post('/braintree/payment',requireSignIn,braintreeTreePayment)

export default router