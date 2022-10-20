const mongoose=require("mongoose")
const userModel=require("../models/userModel")
const addressModel=require("../models/addressModel")
const cartModel=require("../models/cartModel")
const couponModel=require("../models/couponModel")

const cartFunctions = require('../controller/cartFunctions');
const count=require("../middlewares/cartWishCount")


exports.getCheckout = async function(req,res,next){

    try {
        let session=req.session

        userId=req.session.user._id
        let addressData =await  addressModel.find({userId:userId}).lean()
        let cartData= await cartModel.findOne({userId:userId}).populate("products.productId").lean()
        totalAmount=await cartFunctions.totalAmount(cartData)
        let couponData=await couponModel.find().lean()
        let cartcount= await count.getCartCount(req,res);
        let wishlistcount=await count.getWishlistCount(req,res);
        res.render("users/checkOut",{addressData,session,cartData,totalAmount,couponData,cartcount,wishlistcount})
    } catch (error) {
       next(error) 
    }

 

}

exports.billingAddress=async(req,res)=>{

   try {
    userId = req.session.user;
    // console.log("this is req body from billing:",req.body)
     let address = await addressModel.findOne({ userId: userId._id, _id: req.body.address }).lean();
     //console.log(address, "this is the fill address");
     res.json({message:"this is succesfully",  address });
   } catch (error) {
    next(error)
   }
}


