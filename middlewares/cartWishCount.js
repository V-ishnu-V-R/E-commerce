let cartModel= require("../models/cartModel")
let wishlistModel = require('../models/wishlistModel')

module.exports={

    getCartCount:async function(req,res,next){


     try {
          // console.log("req.session;",req.session)
          let userId=req.session.user._id
        
          let cartData =await cartModel.findOne({userId:userId}).lean()
         // console.log(userId,"this is the userId formt he session");
          let cartCount=0;
          if( cartData ){
              cartCount=cartData.products.length;
              return cartCount;
  
          }
     } catch (error) {
        next(error)
     }
    }
    
    ,
    getWishlistCount:async function(req,res,next){


       try {
        let userId = req.session.user._id
        
        let wishlistData=await wishlistModel.findOne({userId:userId}).lean();
        let wishlistCount=0;
        if (wishlistData){
            wishlistCount=wishlistData.products.length;
            return wishlistCount;
        }
       } catch (error) {
        next(error)
       }

    }
}