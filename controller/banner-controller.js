const mongoose=require("mongoose")
const bannerModel=require("../models/bannerModel")
const productModel=require("../models/productModel")
const fs = require("fs");

exports.getBanner=async function(req,res,next){
   try {
    let bannerData=await bannerModel.find({}).populate('product').lean()
    //console.log(bannerData,"this is banner DAta");

    res.render("admin/bannerTable",{layout:false,bannerData})
   } catch (error) {
    next(error)
   }
}


exports.addBanner= async function(req,res,next){

  try {
    let productData=await productModel.find().lean()
    

    res.render("admin/banner",{layout:false,productData})
  } catch (error) {
    next(error)
  }

}
exports.addBannerButton=async function(req,res,next){

  try {
     
    req.body.image = req.file.filename;

    await bannerModel.create(req.body);
    res.redirect('/admin/bannerTable');
  } catch (error) {
    next(error)
  }

}


exports.editBanner=async function(req,res,next){
 try {
    let bannerId = req.params.id;
    let bannerData = await bannerModel.findOne({ _id: bannerId }).lean()
    let productData = await productModel.find().lean()
    res.render("admin/editBanner",{layout:false,bannerData, productData})
 } catch (error) {
    next(error)
 }
}



exports.editBannerButton=async function(req,res,next){
  try {
    let bannerId = req.params.id;
    // console.log("req.body from edit banenr",req.body)
     // let image = req.file
    //console.log("image from edit banner:",req.file);
     if (req.file){
         imagePath= await bannerModel.findOne({ _id: req.params.id }, { _id: 0, image: 1 });
             fs.unlinkSync('public/bannerImages/'+imagePath.image);
             req.body.image = req.file.filename;
             await bannerModel.findOneAndUpdate({ _id: req.params.id }, { image: req.body.image });
         }
     if (req.body.productId) {
      
             await bannerModel.findOneAndUpdate({ _id: req.params.id }, {  productId: req.body.productId });
         }
     if(req.body.heading){
         await bannerModel.findOneAndUpdate({ _id: req.params.id }, { heading: req.body.heading });}
     if(req.body.subHeading){
         await bannerModel.findOneAndUpdate({ _id: req.params.id }, { subHeading: req.body.subHeading });       
     }
     if(req.body.product){
         await bannerModel.findOneAndUpdate({ _id: req.params.id }, { product: req.body.product });       
     }
 
     res.redirect('/admin/bannerTable');
  } catch (error) {
    next(error)
  }


    
}
exports.deleteBanner= async function(req,res,next){
    try {
        let bannerId = req.params.id;
        // await bannerModel.findOneAndDelete({ productId: productId }).lean()
        imagePath= await bannerModel.findOne({ _id: bannerId }, { _id: 0, image: 1 });
        fs.unlinkSync('public/bannerImages/'+imagePath.image);
        await bannerModel.findOneAndDelete({ _id: bannerId });
        res.redirect('/admin/bannerTable');
    } catch (error) {
        next(error)
    }
}




