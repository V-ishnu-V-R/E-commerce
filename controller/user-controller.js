const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category=require("../models/categoryModel")
var express = require("express");
const bcrypt = require("bcrypt");
var router = express.Router();
var mongoose = require("mongoose");
var session = require("express-session");
const twilioController = require("./otp-controller");
const process = require("process");
const count=require("../middlewares/cartWishCount")

const cartModel=require("../models/cartModel")
const Razorpay=require("../controller/razorpay-controller")
const addressModel=require("../models/addressModel")
const orderModel=require("../models/orderModel")
const  checkOut=require("../controller/check-controller")
const order=require("../controller/order-controller")
const bannerModel=require("../models/bannerModel")




// getcartcount= async function(req,res){
// let cart=await cartModel.findOne({userId:req.session.user._id}).lean()
// let cartCount=0;
// if(cart){
//   cartCount=cart.products.length
  
// }
// return cartCount;
// } 




exports.getHome = async function (req, res, next) {
  
 
try {
  const product = await Product.find().populate('category').lean();
  //this will have the details of the product with category as reference will get all the category deatails becuse we have populated the data
  //without poopulate means it will have only object id but not the details about the category  


let categoryData=await Category.find().lean()
let bannerData=await bannerModel.find().populate('product').lean()
// let cartcount= await count.getCartCount(req,res);
//  let wishlistcount=await count.getWishlistCount(req,res);  //no session means no cartcount

 

  let session = req.session;
 
  res.render("index", { product, session ,categoryData,bannerData});
} catch (error) {
  next(error)
}
};




exports.getLogin = function (req, res, next) {
  res.render("users/login", { noHeaders: true });
};



exports.getSignup = function (req, res, next) {
  res.render("users/signup", { noHeaders: true });
};

// exports.getError = function (req, res, next) {
//   res.render("users/error", { noHeaders: true });
// };



// exports.getOtp = function (req, res) {
  
//   res.render("users/otp");
// };



exports.postOtp= async function(req,res,next){
  
try {
  const userdata = await User.findOne({ _id: req.params.id }).lean();
  //console.log(userdata);
  // console.log(req.body.otp);
   let otps = req.body.otp;
   let verification=await twilioController.verifyOtp(otps, userdata);
   if (verification) {
 
     //req.session.loggedIn = true;
     //req.session.userId = userdata._id;
     res.redirect('/login');
   }
   else {
     await User.findOneAndDelete({ _id: req.params.id }).lean();
     res.redirect('/signup')
   }
} catch (error) {
  next(error)
}

}





/////////////SIGNUP ACTION/////////////////
exports.signupAction = async function (req, res, next) {
try {
  const olduser = await User.findOne({ email: req.body.email });
  if (olduser) {
    return res.render("users\\signup", { msg: "User Already exixts" ,  noHeaders: true });
  }

  let newUser = await User.create(req.body)
   
    //console.log("new user",newUser)
    twilioController.sendOtp(newUser)

    let id = newUser._id
    res.render('users/otp',{id})
} catch (error) {
  next(error)
}
  
 
  
};






//////////////////////LOGIN ACTION///////////////////

exports.loginAction = async function (req, res, next) {
 // console.log(req.body);
try {
  if (!req.body.email || !req.body.password)
  return res.render("users\\login", { msg: "User Empty" ,  noHeaders: true });

const userData = await User.findOne({ email: req.body.email });
// console.log(userData);

if (!userData) return res.render("users/login", { msg: "User not Found " ,  noHeaders: true });
// console.log("ivde ithi");

const correct = await bcrypt.compare(req.body.password, userData.password);
if (!correct)
  return res.render("users/login", { msg: "Password incorrect" ,  noHeaders: true });
// console.log("email id compared");

if (userData.active == false ) return res.send("User is blocked");
let session = req.session;
//this session wil have all the details about the session

session.loggedIn = true;
session.user = userData; 
//session.user will have the details of the user that logged in 



res.redirect("/");
} catch (error) {
  next(error)
}
};



exports.getlogout = function (req, res) {
  req.session.loggedIn = false;
  res.redirect("/");
};



exports.viewproduct = async function (req, res,next) {
  try {
    id=req.params.id
  
    //this id have the id of the product becuse in idex page we passed the id on the onclick which is under product each loop .and that id is recived in the routes
    const productDetails= await Product.findOne({_id:id}).populate('category').lean()
    //populated because to find give the breadcrumbs on the viewproducts page
    //the productDetails have the all the details about the product like brand,name, etc of the particular produt that is clicked
    let session = req.session;
    let cartcount= await count.getCartCount(req,res);
    let wishlistcount=await count.getWishlistCount(req,res);
     res.render("users/viewProducts",{productDetails,session,cartcount,wishlistcount});
  } catch (error) {
    next(error)
    
  }


  
};
// exports.getUserProfile=function(req,res){
//   res.render("users/userProfile")
// }
exports.orders = async function(req,res,next){
try {
  userId = req.session.user
  let orderData= await orderModel.find({userId:userId._id}).sort({createdAt:-1}).populate('products.productId').lean()
  //console.log(orderData,"this is shibilyy");
  
  for (let i = 0; i < orderData.length; i++) {
    if (orderData[i].status=="cancelled") {
      orderData[i].cancelled=true
    }else if(orderData[i].status=="Delivered"){
      orderData[i].Delivered=true
    }
   
    }

  let userData=await User.findOne({_id:userId}).lean()
  
  let session = req.session;
  //let status = await orderModel.find({userId:userId}).select({status:"cancelled"}).lean()
  let cartcount= await count.getCartCount(req,res);
  let wishlistcount=await count.getWishlistCount(req,res);
 

res.render("users/orders" ,{userData,orderData,session,cartcount,wishlistcount})
} catch (error) {
  next(error)
}
}

exports.emptyCart= function (req,res){
  res.render("users/emptyCart")

}

exports.viewShop=async function (req,res,next){
try {
  const product = await Product.find().populate('category').lean();

  let categoryData=await Category.find().lean()
  let session = req.session;
  let cartcount= await count.getCartCount(req,res);
  let wishlistcount=await count.getWishlistCount(req,res);
  
  
    res.render("users/shop",{product, session ,categoryData,cartcount,wishlistcount})
} catch (error) {
  next(error)
}
}
  
