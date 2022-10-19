const mongoose=require("mongoose")
var cartModel=require("../models/cartModel")

const cartFunctions = require('../controller/cartFunctions');
const product = require("../models/productModel");
const wishlistModels=require("../models/wishlistModel");
const count=require("../middlewares/cartWishCount")
//const wishlistFunction=require("../controller/wishlistFunction")

exports.addWishlist = async function(req,res,next){
   // console.log('hi wishlist ethi')
    
    const productId=req.body.product
         // console.log(productId,"this is the product id for the wishlist");
    let  userId=req.session.user
         //console.log(userId,"this is the userid or the user in wishlst");
         //console.log(userId._id,"this is the id of the user ");
    wishlist = await wishlistModels.findOne({ userId: userId._id }).lean();
         //console.log(wishlist,'this the wishlist model that just finded');
    
         if (wishlist) {
            productexist = await wishlistModels.findOne({ userId: userId._id, "products.productId": productId });
            if (productexist) 
               return res.json({message:"product already added to wishlist"})
                await wishlistModels.findOneAndUpdate({ userId: userId._id }, { $push: { products: { productId: productId } } });
        
        }
        else { await wishlistModels.create({ userId: userId._id, products: { productId: productId } }); }

        wishlistData = await wishlistModels.findOne(
            { userId: userId._id }
        ).populate("products.productId").lean();
        price = (wishlistData.products[0].productId.sellingPrice);
        // console.log(price);
        await wishlistModels.updateOne({ userId: userId._id, "products.productId": productId },  { "products.$.price": price })

    

}
exports.wishlistData= async function(req,res,next){
    userId = req.session.user;
        wishlistDatas = await wishlistModels.findOne(
            { userId: userId._id }
        ).populate("products.productId").lean();
    
        // totalAmount = await cartFunctions.totalAmount(cartData);
        let session = req.session;
        let cartcount= await count.getCartCount(req,res);
        let wishlistcount=await count.getWishlistCount(req,res);
        res.render('users/wishlist', { userheader: true, wishlistDatas,session,cartcount,wishlistcount}) 
}
exports.delete=async function(req,res,next){
    productId = req.body.product
       
        userId = req.session.user
        // console.log(req.body.product)
       deletes = await wishlistModels.updateOne({ userId: userId._id }, { $pull: { products: { productId: req.body.product } } })
       res.json({message:"the process is succesfull"})
}
