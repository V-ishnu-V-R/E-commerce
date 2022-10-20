
const mongoose=require("mongoose")
var cartModel=require("../models/cartModel")

const cartFunctions = require('../controller/cartFunctions');
const product = require("../models/productModel");
const count=require("../middlewares/cartWishCount")


//to get the cart page
exports.getCart= async function(req,res,next){
  try {
    const productId=req.body.productId
    //data fromt the ajax of the viewproduct
    let  userId=req.session.user
    //so this userId have all the details about the user including full name and all ,so if we give userId_id means we will get the user id.
    
    
    cart = await cartModel.findOne({ userId : userId._id }).lean(); 
    //cart wil have the detailos of the cart of the particulat user 
    if (cart) {
        productexist = await cartModel.findOne({ userId: userId._id, "products.productId": productId });
        
        if (productexist) {
            await cartModel.updateOne({ userId: userId._id, "products.productId": productId }, { $inc: { "products.$.quantity": 1 } });
            res.json({message:"success"})
           
        }
        else {
            await cartModel.findOneAndUpdate({ userId: userId._id }, {$push:{products:{productId:productId,quantity:1}}});
            res.json({message:"success"})
            
        }
    }
    else { await cartModel.create({ userId: userId._id , products:{productId:productId,quantity:1}} );
           res.json({message:"success"}) 
         }
    
    
  } catch (error) {
    next(error)
    
  }
    
    
}
exports.viewcart= async function(req,res,next){
    try {
        
    let  userId=req.session.user._id
    
   
    cartData = await cartModel.findOne(
        {userId:userId}
    ).populate("products.productId").lean();

  // console.log(cartData,"this is the cartData*************************");


  
    var totalAmount;



    if(cartData){
    // To check whether a cart is emypty-------------------------------------------------------------------
          if (cartData.products[0]) {
           totalAmount = await cartFunctions.totalAmount(cartData);
        
        
        
          let session = req.session
          let cartcount= await count.getCartCount(req,res);
          let wishlistcount=await count.getWishlistCount(req,res);
       
          return res.render('users/cart', {session , cartData, totalAmount,cartcount,wishlistcount })
    }
    let session = req.session
    let cartcount= await count.getCartCount(req,res);
    let wishlistcount=await count.getWishlistCount(req,res);
    res.render("users/emptyCart",{session,cartcount,wishlistcount} )
}
    else {
        let session = req.session
        let cartcount= await count.getCartCount(req,res);
        let wishlistcount=await count.getWishlistCount(req,res);
        res.render('users/emptyCart', { session,cartcount,wishlistcount });
    }
        
    } catch (error) {
        next(error)
        
    }
}



exports.increment = async function(req,res,next){
    /////increment fucntion
   try {
    console.log(req.body,"#req.body");
    if(req.body.count == -1 && req.body.quantity == 1){

       //  await cartModel.updateOne({_id:req.body.cartId},{$pull:{products:{productId:req.body.proId}}})

       //  let cartdata = await cartModel.findOne({_id:req.body.cartId}).populate('products.productId').lean()
       //  console.log(cartdata,'DECRSD')
         res.json({minquantity:true})
    }else{
       if(req.body.count== -1 && req.body.quantity<=5){
        await cartModel.updateOne(
        { _id: req.body.cartId, "products.productId": req.body.proId },
            { $inc: { "products.$.quantity": req.body.count } }
          );
          let cartdata = await cartModel.findOne({_id:req.body.cartId}).populate('products.productId').lean()
          console.log(cartdata,':UPDATED')

          res.json({status:true})
       }if(req.body.count ==1 && req.body.quantity<5){
           await cartModel.updateOne(
               { _id: req.body.cartId, "products.productId": req.body.proId },
                   { $inc: { "products.$.quantity": req.body.count } }
                 );
                 let cartdata = await cartModel.findOne({_id:req.body.cartId}).populate('products.productId').lean()
                 console.log(cartdata,':UPDATED')
                 let singleTotal =
                 cartData.products[req.body.index].productId.price *
                 cartData.products[req.body.index].quantity;

                 let totalAmount = await cartFunctions.totalAmount(cartData);

  
                 res.json({status:true,singleTotal,})
           }

    }
   } catch (error) {
    next(error)
   }
} 




    // const quantities = parseInt(req.body.quantity)
       
    // userId = req.session.user;

    //  await cartModel.updateOne({ userId: userId._id, "products.productId": req.body.product },  { "products.$.quantity": quantities });
    //  cartData = await cartModel.findOne(
    //     { userId: userId._id, "products.productId": req.body.product}
    // ).populate("products.productId").lean();
    // //console.log(cartData);
    // price = (cartData.products[req.body.index].productId.sellingPrice * cartData.products[req.body.index].quantity)
    //  quantity = cartData.products[req.body.index].quantity;
    // //console.log(cartData,"hjkhhiuhihyiuhyiukhy");
    // totalAmount = await cartFunctions.totalAmount(cartData);
    // //console.log(totalAmount);
    // return res.json({ message: "the product is incremented",quantity,price, totalAmount })




exports.delete=async function(req,res,next){

   try {
     
    productId = req.body.product
       
    userId = req.session.user
    //console.log(req.body.product)
   //console.log(userId);
   
    cartData = await cartModel.find({ userId: userId._id })
    //onsole.log(cartData);
   deletes = await cartModel.updateOne({ userId: userId._id }, { $pull: { products: { productId: req.body.product } } })
    //console.log(deletes);
    //console.log('delete lorum lipdjsakljflkajkldfjljadflkjlkjklsdfkalfjkljklfjkljklds');
    res.status(200).json({ message: "the product is successfully deleted" });
   } catch (error) {
    next(error)
   }
}




