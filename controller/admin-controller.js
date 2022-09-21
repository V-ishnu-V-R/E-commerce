var express = require("express");
var router = express.Router();
const userController = require("../controller/admin-controller");
const User = require("../models/userModel");
var mongoose = require("mongoose");
const category = require("../models/categoryModel");
const products=require("../models/productModel")
const fs= require('fs')


const adminMail="admin@gmail.com"
const adminPass="admin12"

// exports.adminSession=(req,res,next)=>{
//   if(req.session.adminLogged){
//     next()
//   }else{
//     res.redirect("/admin/dashboard")
//   }
// }


exports.getAdmin=function(req,res,next){

  res.render("admin/signin")
}
exports.logout=function(req,res){
  res.render("admin/signin")
}
exports.getAdminPage = function (req, res, next) {
  console.log('hjhjhjh');
  if((adminMail==req.body.email) && (adminPass==req.body.password)){
   // req.session.adminLogged=true
   res.redirect("/admin/dashboard");
  }else{
    res.send("password id weor")
  }
};
exports.getAdminDashboard = function (req, res, next) {
  res.render("admin/dashboard");
};

exports.getAdminProducts =async function (req, res) {
 const productDetails= await products.find().lean()

  res.render("admin/products" ,{productDetails});
};
exports.getAdminCategory = async function (req, res) {
  const categoryDetails = await category.find().lean();
  console.log(categoryDetails);
  res.render("admin/category", { categoryDetails });
};
exports.getAdminUsers = async function (req, res) {
  const userDetails = await User.find().lean();
  res.render("admin/users", { userDetails }); //userdetails os here
};
exports.getAddCategory =  function (req, res) {
  
  res.render("admin/add-Category");
};

exports.createCategory = async function (req, res) {
  categoryExist = await category
    .findOne({ Category: req.body.Category })
    .lean();
  if (categoryExist) {
    return res.send("Category already exits");
  }
  console.log(req.body);
  if(req.body.Category===""){
    return res.send("please all some field")
  }
  await category.create(req.body);
  res.redirect("/admin/category");
};

exports.getEditCategory= async function(req,res){
 categorydata= await category.findOne({_id:req.params.id},{Category:1}).lean()
  const categoryId=req.params.id

 res.render("admin/edit-Category",{categorydata})

}
exports.getEditCategoryId = async function(req,res){
  console.log(req.params.id);
   await category.findOneAndUpdate({"_id":req.params.id},{$set:{"Category":req.body.Category}})
   res.redirect("/admin/category")

}

exports.deleteCategoryId= async function(req,res){
  console.log(req.params.id);
  await category.deleteOne({_id:req.params.id})
  res.redirect("/admin/category")
}
exports.blockUser= async function(req,res){
  console.log(req.params.id);
  await User.updateOne({_id:req.params.id},{$set:{active:false}})
  
  res.redirect("/admin/users")
}

exports.unblockUser= async  function(req,res){
  await User.updateOne({_id:req.params.id},{$set:{active:true}})
 
  res.redirect("/admin/users")
}

exports.getAddProducts= async function(req,res){
  const categoryData= await category.find().lean()

  
  res.render("admin/add-products",{categoryData})
}

exports.AddProducts= async function(req,res){
  const productnames = await products.findOne({ name: req.body.name }).lean();
            console.log(productnames);
        if (productnames) 
            return res.send('product already exists');
        const arrImages = req.files.map((value) => value.filename);
      
        req.body.imagepath = arrImages;
 await products.create(req.body)
  res.redirect("/admin/products")
}


///TestDatatable need css ans other cdn to link/////
exports.datatable=function(req,res){
  res.render("admin/datatable")
}
//////////////////////////////////////////////////

exports.deleteProduct= async function(req,res){
  await products.deleteOne({_id:req.params.id})
  
  res.redirect("/admin/products")
}












// exports.createCategory=(req,res)=>{

//   const newCat=new category({
//     Category:req.body.name
//   })
//   newCat.save()
// }
