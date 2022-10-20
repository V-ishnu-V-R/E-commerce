const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const addressModel = require("../models/addressModel");
let cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const razorpayController=require('../controller/razorpay-controller')
const couponModel=require("../models/couponModel")

const cartFunctions = require("../controller/cartFunctions");
const { totalAmount } = require("../controller/cartFunctions");
const count=require("../middlewares/cartWishCount")


exports.orderconfirm = async (req, res,next) => {
  // We have taken all the data frmm the billing address using ajax and stored in the oreder doc

try {
  userId = req.session.user._id;
  //console.log("reached here");
 // console.log(req.body.firstName, "this is from the confirm order"); //this will give the firstName of the billingaddress

  let cartData = await cartModel.findOne({ userId: userId }).populate('products.productId').lean();
  // we have taken all the data from the cart data and stored it in the order model
  //console.log(cartData, "this is the cartData fromt the confirm order");
  var totalAmount = await cartFunctions.totalAmount(cartData);


  // let orderData = await orderModel.create({
  //   userId: userId,
  //   billingAddress: req.body,
  //   products: cartData.products,
  //   status: "Placed",
  //   paymentMethod: req.body.paymentMethod,
  //   grandtotal:totalAmount

  // });

  

  //console.log(orderData,"thiss is the oerdrdataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  // this orderData have all the deatails like billing address, produt ,etc.
  //console.log(orderData.paymentMethod, "this is the paymentmethod ");
  //totalAmount = await cartFunctions.totalAmount(cartData);
  //console.log("totalAmount",totalAmount);
  let totalAmounts = totalAmount * 100;


  if(req.session.coupon){
    //console.log("session:",req.session.coupon);
    let discountAmount = req.session.coupon.discountAmount;
    //console.log("discount AMount",discountAmount)
    var totalAmount = totalAmount - discountAmount
    //console.log("total Amount",totalAmount)
    await couponModel.findOneAndUpdate({_id:req.session.coupon._id },{$set:{users:userId}});
}
//console.log("type Of total AMount Outsiude:",typeof(totalAmount))
let orderData = await orderModel.create({ userId: userId, "billingAddress": req.body, "products": cartData.products, "status": "placed", "paymentMethod": req.body.paymentMethod, grandTotal: totalAmount})





  
  orderDataPopulated = await orderModel.findOne({ _id: orderData._id }).populate("products.productId").lean();

  



  req.session.orderData = orderData
  //console.log("orderdata session", req.session)
  if (orderData.paymentMethod == 'COD') {
      req.session.orderData = null;
      
      req.session.confirmationData = { orderDataPopulated, totalAmount };
      res.json({ status: "COD", totalAmounts, orderData })
  } else if (orderData.paymentMethod == 'Online Payment') {
      let orderData = req.session.orderData
      req.session.orderData = null;
      //console.log("order data ajax:", orderData._id)
      //console.log("amount data ajax:", totalAmounts)
      //console.log("session data ajax:", req.session)
      razorData = await razorpayController.generateRazorpy(orderData._id, totalAmounts)
      

      await orderModel.findOneAndUpdate({ _id: orderData._id }, { orderId: razorData.id });
      //console.log("razordata returns;",razorData);
      razorId = process.env.RAZOR_PAY_ID;

      req.session.confirmationData = { orderDataPopulated, totalAmount };
      
      res.json({ message: 'success', totalAmounts, razorData, orderData });
  }
} catch (error) {
  next(error)
}
};


exports.verifyPay=async(req, res, next) => {
 // console.log(req.body, "hihihihihihhhihhihh");
try {
  success= await razorpayController.validate(req.body);
  if (success)
  {
     await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] },{paymentStatus:"success"});
     return res.json({ status: "true" });
  }
  else
  {
      await orderModel.findOneAndUpdate({ orderId: req.body['razorData[id]'] }, { paymentStatus: "failed" });
      return res.json({ status: "failed" });
      }
} catch (error) {
  next(error)
}
}

exports.confirmationPage= async (req, res, next) => {

try {
  let session=req.session
  //console.log(session,"this is the session in confirm page11111");
  await cartModel.findOneAndDelete({userId:req.session.user._id})
 
  //req.session.confirmationData = null;
   res.render('users/confirmOrder', {session});
} catch (error) {
  next(error)
}
}
exports.cancelOrder=async function(req,res,next){
try {
  orderId=req.body.orderId 
  await orderModel.findOneAndUpdate({_id:orderId},{$set:{status:"cancelled"}})

  
  res.json({message:"item cancelled"})
} catch (error) {
  next(error)
}
}

