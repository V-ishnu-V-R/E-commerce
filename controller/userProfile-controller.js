const mongoose=require("mongoose")
const userModel=require("../models/userModel")
const bcrypt = require("bcrypt");
const addressModel=require("../models/addressModel")
const count=require("../middlewares/cartWishCount")



exports.profileDetails= async function(req,res,next){
userId=req.session.user
let userDetails=await userModel.findOne({_id:userId._id}).lean()
let addressData= await addressModel.find({userId:userId._id}).lean()

//console.log(userDetails);
let session = req.session
let cartcount= await count.getCartCount(req,res);
let wishlistcount=await count.getWishlistCount(req,res);

res.render("users/userProfile",{userDetails,session,addressData,cartcount,wishlistcount})
}


exports.changeUsername=async function(req,res,next){
    
    userId=req.session.user
    

    await userModel.findOneAndUpdate({userId:userId._id},{$set:{"fname":req.body.name}})
    res.json({})

}
exports.changePassword=  async function (req, res,next){
userId=req.session.user
// console.log(req.body.oldpass);
// console.log(req.body.newpass);
// console.log(req.body.confnewpass);
//  console.log("the changae password func is workinfg");
let userData = await userModel.findOne({userId:userId})
let correct = await bcrypt.compare(req.body.oldpass,userData.password)
// if(req.body==null){
//     alert("please fill the form")
// }
if (Object.keys(req.body).length === 0) {
    res.send("please fill the form")
 }
if (correct =true){
    console.log("old password is correct ");
    //let newpassword=await userModel.findOneAndUpdate({userId:userId},{$set:{password:req.body.newpass}})
    let newpassword=await bcrypt.hash(req.body.newpass,10)
    await userModel.findOneAndUpdate({_id:userId},{$set:{"password":newpassword}})

}else res.send("incorrect");
res.json({});
}


exports.manageAddress= async function(req,res){
    let session = req.session
    let cartcount= await count.getCartCount(req,res);
    let wishlistcount=await count.getWishlistCount(req,res);
    res.render("users/manageAddress" ,{session,cartcount,wishlistcount})
}
exports.addAddress= async function(req,res){
   // console.log("this is the body of the add address");
  // console.log(req.body);
    userId=req.session.user._id
    //console.log("this is the uesr id of the user that is logged in  now");
    //console.log(userId);
    req.body.userId=userId
    await addressModel.create(req.body);



    res.redirect("/userProfile")
}


exports.deleteAddress= async function(req,res){
 let deleteId=req.body.addressId
 //console.log(deleteId,"this is the id of the address");
   await addressModel.findByIdAndDelete({_id:deleteId}) 
    res.json({})
}  


exports.editAddress = async function(req,res){
    //console.log(req.body,"this is the edit address body");
    let addressId=req.params.id
    //console.log(addressId);
    await addressModel.findOneAndUpdate({_id:addressId},{$set:{"firstName":req.body.firstName,"lastName":req.body.lastName,"email":req.body.email,"phoneNumber":req.body.phoneNumber,"address":req.body.address,"city":req.body.city,"state":req.body.state,"landMark":req.body.landMark}})
    res.redirect("/userProfile")
}
