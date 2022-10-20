var express = require("express");
var router = express.Router();
var session = require("express-session");
var mongoose = require("mongoose");
const { resolve } = require("promise");
const userController = require("../controller/user-controller");
const sessionCheck = require('../middlewares/session')
const Users = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const Otp=require("../controller/otp-controller")
const cart=require("../controller/cart-controller")
const wishlist=require("../controller/wishlist-controller")
const profileController= require("../controller/userProfile-controller")
const checkoutcontroller=require("../controller/check-controller")
const order=require("../controller/order-controller")
const adminController=require("../controller/admin-controller")
const count=require("../middlewares/cartWishCount")








////////////////////////Functions calling/////////////////////
router.get("/",userController.getHome);
router.get("/login", userController.getLogin);
router.get("/signup", userController.getSignup);
router.post("/signup/", userController.signupAction);
router.post("/login", userController.loginAction);


//router.get("/otp",userController.getOtp)
router.post("/otp/:id",userController.postOtp)
router.get("/logout",userController.getlogout)
router.get("/viewProducts/:id",sessionCheck.userSessionChecker,userController.viewproduct)
router.post("/addToCart",sessionCheck.userSessionChecker,cart.getCart)
router.get("/viewcart",sessionCheck.userSessionChecker,cart.viewcart)

router.post('/changeQuantity',cart.increment);  
router.post('/deleteProduct',sessionCheck.userSessionChecker,cart.delete);
router.post("/wishlist",sessionCheck.userSessionChecker,wishlist.addWishlist)
router.get('/wishlistData',sessionCheck.userSessionChecker, wishlist.wishlistData);
router.post('/deletewishlist',sessionCheck.userSessionChecker, wishlist.delete);
router.get("/userProfile",sessionCheck.userSessionChecker,profileController.profileDetails)
router.patch("/changeUsername",sessionCheck.userSessionChecker,profileController.changeUsername)
router.patch("/changePassword",sessionCheck.userSessionChecker,profileController.changePassword)
router.get("/manageAddress",sessionCheck.userSessionChecker,profileController.manageAddress)
router.post("/addAddress",sessionCheck.userSessionChecker,profileController.addAddress)
router.post("/deleteAddress",sessionCheck.userSessionChecker,profileController.deleteAddress)
router.post("/editAddress/:id",sessionCheck.userSessionChecker,profileController.editAddress)
router.get("/checkOut",sessionCheck.userSessionChecker,checkoutcontroller.getCheckout)
router.post('/billingAddress',sessionCheck.userSessionChecker,checkoutcontroller.billingAddress)
router.get("/orders",sessionCheck.userSessionChecker, userController.orders)     //this is in the userProfile
router.post("/confrimOrder",sessionCheck.userSessionChecker,order.orderconfirm)
router.post('/verifyRazorpay', sessionCheck.userSessionChecker, order.verifyPay);
router.get('/renderConfirmation', sessionCheck.userSessionChecker, order.confirmationPage) 
router.post("/cancelOrder",sessionCheck.userSessionChecker, order.cancelOrder)
router.get("/emptyCart",sessionCheck.userSessionChecker,userController.emptyCart)
router.post("/couponValidation",sessionCheck.userSessionChecker,adminController.validateCoupon)
router.get("/viewShop",sessionCheck.userSessionChecker,userController.viewShop)



// router.post("/otpverify",userController.otpVerify)

// router.get("/otp", function (req, res, next) {
//   res.render("users/otp");
// });





/////////////////ERROR PAGE////////////////


//router.get("*",userController.getError);
///////////////////////////////////////////
module.exports = router;
