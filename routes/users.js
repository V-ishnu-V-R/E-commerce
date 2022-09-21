var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { resolve } = require("promise");
const userController = require("../controller/user-controller");
const Users = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const Otp=require("../controller/otp-controller")







////////////////////////Functions calling/////////////////////
router.get("/", userController.getHome);
router.get("/login", userController.getLogin);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.signupAction);
router.post("/login", userController.loginAction);

router.get("/otp",userController.getOtp)
//router.post("/otpverify/:id",userController.otpVerify)







// router.get("/otp", function (req, res, next) {
//   res.render("users/otp");
// });
// //login check
// router.post("/login",  async (req, res) => {
//   try{
//     const email =req.body.email
//     const password =req.body.password
//    const userEmail= await Users.findOne({email:email}) //to find the email is there in the db

//    const isMatch= await bcrypt.compare(password,userEmail.password)

//    if(isMatch){
//     res.status(201).render("users/islogin")
//    }else{
//     console.log("password is wrong xx");
   
//     res.send("invalid passwords")
//    }
// } catch(err){
//     res.status(400).send("invalid email/password")
//   }
// });
//  const createToken= async()=>{
//   const token= await jwt.sign({_id:"631ae739568e94b27a6afcc7"},"mynameisramurajuandiamausercollectioninthedarabaseoftimeless",{
//     expiresIn:"2 seconds"})

//   console.log("token is",token);
// const userVer=await jwt.verify(token,"mynameisramurajuandiamausercollectioninthedarabaseoftimeless")
// console.log(userVer);
//  }
//  createToken()






module.exports = router;
