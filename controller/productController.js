import slugify from "slugify"
import productModel from "../models/productModel.js"
import categoryModel from "../models/categoryModel.js"
// import orderModel from "../models/orderModel.js"
import fs from 'fs'
// import braintree from "braintree"

// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  
// });

export const createProductController = async (req,res) =>{
    try {
        const { name, description, price, category, quantity, shipping } =
          req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case photo && photo.size > 1000000:
            return res
              .status(500)
              .send({ error: "photo is Required and should be less then 1mb" });
        }
    
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path);
          products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
          success: true,
          message: "Product Created Successfully",
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in crearing product",
        });
      }
}

export const getproductController = async (req,res) =>{
   try{
      const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
      res.status(200).send({
        success:true,
        total:products.length,
        message:"all products",
        products,
    
      });
   }
   catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        message:"error in getting products",
        err:err.message
    })
   }
}

export const getsingleproductController = async (req,res) =>{
   try{
       const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
       res.status(200).send({
        success:true,
        message:"single product successfully",
        product,

       })
   }
   catch(err){
    console.log(err)
    res.status(500).send({
        success:false,
        message:"error in getting single product",
        err
    })
   }
}

export const productphotoController = async (req,res) =>{
    try{
       const product = await productModel.findById(req.params.pid).select("photo")
       if(product.photo.data){
        res.set('Content-type',product.photo.contentType)
        return res.status(200).send(product.photo.data)
       }
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"error in getting photo",
            err
        })
    }
}

export const deleteProductController = async (req,res) =>{
    try{
         await productModel.findByIdAndDelete(req.params.pid).select("-photo")
         res.status(200).send({
            success:true,
            message:"product deleting successfully"
         })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            message:"deleting product error"
        })
    }
}

export const updateProductController = async (req,res) =>{
    try{
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
    
        switch(true){
            case !name:
                return req.status(500).send({error:'name is required'})
            case !description:
                return req.status(500).send({error:'description is required'})  
            case !price:
                return req.status(500).send({error:'price is required'})
            case !category:
                return req.status(500).send({error:'category is required'})
            case !quantity:
                return req.status(500).send({error:'quantity is required'})
            case photo && photo.size > 1000000:
                return req.status(500).send({error:'photo is required and should be less than 1 MB'})       
    
        }
    
       const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
       if(photo){
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType = photo.type
       }
       await products.save()
       res.status(200).send({
        success:true,
        message:"product updated successfully",
        products,
       })
     }
     catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            message:"error in creating product"
        })
     }
}

export const productFilterController = async (req,res) =>{
    try{
        const {checked,radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
          success:true,
          products,
        })
    }
    catch(err){
      console.log(err)
      res.status(500).send({
        success:false,
        err,
        message:"error in filtering products"
      })
    }
}

export const productcountController = async (req,res) =>{
    try{
       const total = await productModel.find({}).estimatedDocumentCount()
       res.status(200).send({
        success:true,
        total
       })
    }
    catch(err){
      console.log(err)
      res.status(500).send({
        success:false,
        err,
        message:"error in product count"
      })
    }
}

export const productListController = async (req,res)=>{
  try{
     const perPage = 4
     const page = req.params.page ? req.params.page : 1
     const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})
     res.status(200).send({
      success:true,
      products
     })
  }
  catch(err){
    console.log(err)
    res.status(500).send({
      success:false,
      message:"err in per page",
      err
    })
  }
}

export const searchproductController = async (req,res) =>{
     try{
       const {keyword} = req.params
       const result = await productModel.find({
        $or:[
          {name:{$regex :keyword,$options:"i"}},
          {description:{$regex :keyword,$options:"i"}}

        ]
       }).select("-photo");
       res.json(result)
     }
     catch(err){
      console.log(err)
      res.status(500).send({
        success:false,
        err,
        message:"error in search product API"
      })
     }
}

export const relatedproductController = async(req,res) =>{
     try{
       const {pid,cid} = req.params
       const products = await productModel.find({
        category:cid,
        _id:{$ne:pid}
       }).select("-photo").populate("category")
       res.status(200).send({
        success:true,
        products,
       })
     } 
     catch(err){
      console.log(err)
      res.status(500).send({
        success:false,
        err,
        message:"error in related product"
      })
     }
}

export const productCategoryController = async(req,res)=>{
  try{
     const category = await categoryModel.findOne({slug:req.params.slug})
     const products = await productModel.find({category}).populate('category')
     res.status(200).send({
      success:true,
      category,
      products
     })
  }
  catch(err){
    console.log(err)
    res.status(500).send({
      success:false,
      err,
      message:"error while getting products"
    })
  }
}

// export const braintreeTreeToken = async (req,res) =>{
//   console.log(publicKey)
//    try{
//      gateway.clientToken.generate({},function(err,response){
//       if(err){
//         res.status(500).send(err)
//       }
//       else{
//         res.send(response)
//       }
//      })
//    }
//    catch(err){
//     console.log(err)

//    }
// }

// export const braintreeTreePayment = async (req,res) =>{
//    try{
//      const {cart,nonce} = req.body
//      let total = 0
//      cart.map((i)=>{total += i.price})

//       let newTransaction = gateway.transaction.sale({
//         amount:total,
//         paymentMethodNonce:nonce,
//         options:{
//           submitForSettlement:true
//         }
//       },
//      function(error,result){
//        if(result){
//          const order = new orderModel({
//           products:cart,
//           payment:result,
//           buyer:req.user._id
//          }).save()
//          res.json({ok:true})
//        }
//        else{
//        res.status(500).send(error)
//        }
//      }
//     )
//    }
//    catch(err){
//     console.log(err)
//    }
// }