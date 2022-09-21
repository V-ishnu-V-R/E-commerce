const User = require("../models/userModel");
const Product=require("../models/productModel")
var express = require("express");
const bcrypt = require("bcrypt");
var router = express.Router();
var mongoose = require("mongoose");
var session =require("express-session")
const Otp=require("../controller/otp-controller")
const process=require("process");
const { response } = require("../app");

exports.getHome =async function (req, res, next) {
  const product= await Product.find().lean()
  console.log("fffffffffffffffffffffffffff",product);
  res.render("index",{product});
};

exports.getLogin = function (req, res, next) {
  res.render("users/login");
};
exports.getSignup = function (req, res, next) {
  res.render("users/signup");
};
exports.getOtp=function(req,res){
  res.render("users/otp")
}

/////////////SIGNUP ACTION/////////////////
exports.signupAction= async function(req,res,next){
  const olduser = await User.findOne({ email: req.body.email });
      if (olduser) {
        console.log("checking for old user");
        return res.json({ status: "faileddd" });
      }
      
      const newUser = await User.create(req.body)
      // console.log(newUser,'hihihihihihihiihihihihihihihihihihihihihi');
      // Otp.doSms(newUser);
      // const id = newUser._id;
      // console.log(id);
  //  req.session.userLoggedin = true;
   res.render("users/otp")

  }
  // exports.otpVerify=async(req, res, next) => {
  //   console.log('ethiii');
  //   console.log(req.params.id);
  //   const userdata = await User.findOne({ _id: req.params.id }).lean();
    
  //   otps = req.body.name;
  //   console.log(otps);
  //   verification=await Otp.otpVerify(otps, userdata);
  //   if (verification) {
  //     res.redirect('/');
  //   }
  //   else
  //     res.redirect('/users/otp')
  // }


  exports.loginAction = async function(req,res,next){
    console.log(req.body);
    if (!req.body.email || !req.body.password) return res.render('users\\login', {msg: 'User Empty'})

    const userData= await User.findOne({email:req.body.email});
    console.log(userData);

    if (!userData) return res.render('users\\login', {msg: 'User not Found'})
    console.log('ivde ithi');

    const correct = await bcrypt.compare(req.body.password, userData.password);
    if (!correct) return res.render('users\\login', {msg: 'password incorrect'})
    console.log("email id compared");

    if(userData.active==false) return res.send("user is blocked")
    
     req.session.userLoggedin = true;

    res.render("home-01.hbs")

  }
  
  



















/////////////////SIGNUPACTION////////////////////
// exports.signupAction = async (req, res) => {
//   try {
   
//     const olduser = await User.findOne({ email: req.body.email });
//     if (olduser) {
//       console.log("checking for old user");
//       return res.json({ status: "faileddd" });
//     }
//       const newUser = await new User({
//         fname: req.body.fname,
//         lname: req.body.lname,
//         email: req.body.email.toLowerCase(),
//         number: req.body.number,
//         password: req.body.password,
//         confirmPassword: req.body.confirmPassword,
//       });
//       newUser.save();
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN,
        
//       });
//       // user.token=token
//       // return token
//       console.log(token);
//       //console.log('hi');
//       res
//         .cookie("jwt", token, { JWT_EXPIRES_IN, httpOnly: true })
//         .status(201)
//         .render('viwes/users/home-01.hbs')
//         .json({
//           status: "success",
//           token,
//           data: {
//             user: newUser,
//           },
          
//         });
//     }
//    catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// ////////////////////////LOGINACTION/////////////////
// exports.loginAction = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       const validate = await bcrypt.compare(req.body.password, user.password);
      
//       if (validate) {
//         const token = jwt.sign({ user }, process.env.JWT_SECRET);
//         res.cookie("jwt", token, { JWT_EXPIRES_IN:"1h", httpOnly: true }).json({message:"this is cookie page"});
        
//       } else {
//         res.json({ status: 200, message: "Invaild Email Or Password" });
//       }
//     } else {
//       res.json({ status: 200, message: "Please signin" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// module.exports = {
//      getHome :  function (req, res, next) {
//         res.render("index");
//       },
//        getLogin : function (req, res, next) {
//         res.render("users/login");
//       },
//        getSignup : function (req, res, next) {
//         res.render("users/signup");
//       },
//       signupAction : async (req,res) =>{
//         try
//         {
//               //console.log(token)
//              console.log(req.body)
//      const newUser = await User.signupAction(req.body)
//         //     fname: req.body.fname,
//         //     lname: req.body.lname,
//         //     email :req.body.email,
//         //     number:req.body.number,
//         //     password:req.body.password,
//         //     confirmPassword:req.body.confirmPassword

//         //   })
//          //console.log(newUser);
//           //const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn :process.env.JWT_EXPIRES_IN})
//           //console.log(token)
//            //console.log('hi');
//                res.status(201).json({
//                    status:'success',

//                    data:{
//                        user:newUser
//                    }
//                });
//         } catch(err){
//                res.status(400).json({
//                    status:'fail',
//                    message:err
//                })
//            }

//        }

//     }

//     //   postSignupAction : async (req, res,next)  => {
//     //     try{
//     //       const password=req.body.password
//     //       const cpassword= req.body.confirmPassword
//     //       if(password===cpassword){
//     //         const signupUser= await Signup.create({  //this User is the model requird above .signupUser is a instance of the  User collection
//     //           fname:req.body.fname,
//     //           lname:req.body.lname,
//     //           email:req.body.email,
//     //            number:req.body.number,
//     //            password:password,
//     //           confirmPassword:cpassword

//     //         })

//             //console.log("the success part"+signupUser);
//            // const token= await signupUser.generateAuthToken()

//             // const signedup= await signupUser.save()
//             // res.status(200).render("home-01.hbs")

//         //   }else{
//         //     res.send("paswors are not matchig")
//         //   }

//         // }catch(err){
//         //   res.status(400).send(err)
//         //   console.log("the erroer part page");
//         // }

// // module.exports = {
// //     doSignup: (userData)=>{
// //         console.log(userData);
// //         return new Promise(async (resolve,reject)=>{
// //             let user = await db.findOne({email:userData.email})
// //             const state = {
// //                 userExist: false,
// //                 user: null
// //             }
// //             if(!user){
// //                 userData.password = await bcrypt.hash(userData.password, 10)
// //                 db.create(userData).then((data)=>{
// //                     console.log(data,"vishnu kuttan")
// //                     state.userExist = false
// //                     state.user = userData
// //                     state.email = userData.email
// //                     resolve(state)
// //                 })
// //             }else{
// //                 state.userExist=true
// //                 resolve(state)
// //             }
// //         })
// //     },
// //     doLogin: (userData) => {
// //         console.log(userData);
// //         return new Promise(async (resolve, reject) => {
// //             let loginStatus = false;
// //             let response = {};
// //             let user = await db.findOne({ email: userData.email })
// //             console.log(user)
// //             if (user) {
// //                 bcrypt.compare(userData.password,user.password).then((status) => {

// //                     console.log(userData.password);
// //                     if (status) {
// //                         console.log(status);
// //                         console.log("login success");
// //                         response.user = user;
// //                         response.status = true;
// //                         response.email = user.email;
// //                         resolve(response);
// //                     } else {
// //                         console.log("login failed");
// //                         resolve({ status: false })
// //                     }
// //                 })
// //             } else {
// //                 console.log("failed");
// //                 resolve({ status: false })
// //             }
// //         })
// //     }
// // }
