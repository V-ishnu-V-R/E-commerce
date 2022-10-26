var express = require("express");
var router = express.Router();
const userController = require("../controller/admin-controller");
const User = require("../models/userModel");
var mongoose = require("mongoose");
const category = require("../models/categoryModel");
const products = require("../models/productModel");
var session = require("express-session");
const fs = require("fs");
const orderModel= require("../models/orderModel")
const couponModel =require("../models/couponModel")

const adminMail = "admin@gmail.com";
const adminPass = "admin12";

exports.getAdmin = function (req, res, next) {

  if (req.session.loggedIn) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/signin", { layout: false });
  }

};
exports.logout = function (req, res,next) {
  req.session.loggedIn = false;
  res.render("admin/signin", { layout: false });
};
exports.getAdminPage =async function (req, res, next) {
 // console.log("hjhjhjh");
  try {
    if (adminMail == req.body.email && adminPass == req.body.password) {
      req.session.loggedIn = true;
      
      
  
      res.redirect("/admin/dashboard");
    } else {
      res.send("password is wrong");
    }
  } catch (error) {
    next(error)
  }
};
exports.getAdminDashboard = async function (req, res, next) {

try {
  let delivered = await orderModel.find({status:'Delivered'},{status:1,_id:0}).lean()
  //console.log(delivered,"delivereddd dd cosanui ==");
let deliveredCount = delivered.length
let shipped = await orderModel.find({status:'Shipped'},{status:1,_id:0}).lean()
let shippedCount = shipped.length
let cancelled = await orderModel.find({status:'cancelled'},{status:1,_id:0}).lean()
let cancelledCount = cancelled.length
let placed = await orderModel.find({status:'placed'},{status:1,_id:0}).lean()
let placedCount = placed.length
let orderData = await orderModel.find().populate('products.productId').lean()
//console.log(orderData,"orderData shhas")
const deliveredOrder = orderData.filter(e=>e.status=='Delivered')
// console.log("delivered Order shihas",deliveredOrder);
//console.log(deliveredOrder[0].grandTotal,"111111111111");
const TotalRevenue = deliveredOrder.reduce((accr,crr)=>accr+crr.grandTotal,0)

console.log(TotalRevenue ,"total revenue shihas");

const eachDaySale = await orderModel.aggregate([{$match:{status:"Delivered"}},{$group: {_id: {day: {$dayOfMonth: "$createdAt"},month: {$month: "$createdAt"}, year:{$year: "$createdAt"}},total: {$sum: "$grandTotal"}}}]).sort({_id: -1})
//console.log(eachDaySale,"each Day sale shihas");
//res.render('admin/dashboard', { layout: "adminLayout", admin: true, deliveredCount, shippedCount, cancelledCount, placedCount ,TotalRevenue,eachDaySale})


res.render("admin/dashboard", { layout: false ,deliveredCount,shippedCount,cancelledCount,placedCount,TotalRevenue,eachDaySale});
} catch (error) {
  next(error)
}
};

exports.getAdminProducts = async function (req, res,next) {
  try {
    const productDetails = await products.find().populate('category').lean();

  res.render("admin/products", { productDetails, layout: false });
    
  } catch (error) {
    next(error)
  }
  
};
exports.getAdminCategory = async function (req, res,next) {

  try {const categoryDetails = await category.find().lean();
    // console.log(categoryDetails);
     res.render("admin/category", { categoryDetails, layout: false });
    
  } catch (error) {
    next(error)
    
  }


};
exports.getAdminUsers = async function (req, res,next) {
  try {
    const userDetails = await User.find().lean();
    res.render("admin/users", { userDetails, layout: false }); //userdetails os here
    
  } catch (error) {
    next(error)
  }


 

};
exports.getAddCategory = function (req, res) {
  res.render("admin/add-Category", { layout: false });
};

exports.createCategory = async function (req, res,next) {


try {
  categoryExist = await category
  .findOne({ Category: req.body.Category })
  .lean();
if (categoryExist) {
  return res.send("Category already exits");
}
// console.log(req.body);
if (req.body.Category === "") {
  return res.send("please all some field");
}
await category.create(req.body);
res.redirect("/admin/category");
} catch (error) {
  next(error)
}


};

exports.getEditCategory = async function (req, res,next) {


 try {
  categorydata = await category
  .findOne({ _id: req.params.id }, { Category: 1 })
  .lean();
const categoryId = req.params.id;

res.render("admin/edit-Category", { categorydata, layout: false });
 } catch (error) {
  next(error)
 }


};
exports.getEditCategoryId = async function (req, res,next) {
 // console.log(req.params.id);

 try {
  await category.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { Category: req.body.Category } }
  );
  res.redirect("/admin/category");
 } catch (error) {
  next(error)
 }

};

exports.deleteCategoryId = async function (req, res,next) {


 // console.log(req.params.id);
try {
  await category.deleteOne({ _id: req.params.id });
  res.redirect("/admin/category");
} catch (error) {
  next(error)
}

};



exports.blockUser = async function (req, res,next) {
try {
   // console.log(req.params.id);
   await User.updateOne({ _id: req.params.id }, { $set: { active: false } });

   res.redirect("/admin/users");
} catch (error) {
  next(error)
}
};



exports.unblockUser = async function (req, res,next) {

try {
  await User.updateOne({ _id: req.params.id }, { $set: { active: true } });

  res.redirect("/admin/users");
} catch (error) {
  next(error)
}
};



exports.getAddProducts = async function (req, res,next) {

try {
  
  const categoryData = await category.find().lean();

  res.render("admin/add-products", { categoryData, layout: false });
} catch (error) {
  next(error)
}

};



exports.AddProducts = async function (req, res,next) {
try {
  const productnames = await products.findOne({ name: req.body.name }).lean();
  //console.log(productnames);
  if (productnames) return res.send("product already exists");
  const arrImages = req.files.map((value) => value.filename);

  req.body.imagepath = arrImages;
  await products.create(req.body);
  res.redirect("/admin/products");
} catch (error) {
  next(error)
}
};







exports.deleteProduct = async function (req, res,next) {

 try {
  await products.deleteOne({ _id: req.params.id });

  res.redirect("/admin/products");
 } catch (error) {
  next(error)
 }

};



exports.geteditProducts = async function (req, res,next) {
try {
  editId = req.params.id;
  // console.log(req.params.id);
   const productData = await products.findOne({ _id: editId }).lean();
   // console.log("ethiloooooooooooooo", productData);
   const categoryData = await category.find().lean();
 // console.log(categoryData);
   res.render("admin/edit-products", {
     productData,
     categoryData,
     layout: false,
   });
} catch (error) {
  next(error)
}
};



exports.editProducts = async function (req, res,next) {
try {
  let arrImages = req.files.map((value) => value.filename);
  // console.log(arrImages);
  if (arrImages[0]) {
    imagepat = await products
      .findOne({ _id: req.params.id }, { imagepath: 1, _id: 0 })
      .lean();
    //console.log(imagepat);
    imagepat.imagepath.map((i) =>
      fs.unlinkSync(path.join(__dirname, "..", "public", "productUploads", i))
    );
    req.body.imagepath = arrImages;
    await products.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          brand: req.body.brand,
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
          stock:req.body.stock,
          sellingPrice: req.body.sellingPrice,
          discount: req.body.discount,
          imagepath: req.body.imagepath,
        },
      }
    );
  } else {
    await products.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          brand: req.body.brand,
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
          sellingPrice: req.body.sellingPrice,
          stock:req.body.stock,
          discount: req.body.discount,
        },
      }
    );
  }
  res.redirect("/admin/products");
} catch (error) {
  next(next)
}
};

// exports.userManage=function (req,res){
//   //res.render("admin/userManage ", { layout: false })

//   res.send("this is userManagemetn")
// }


exports.userManage = async function (req, res, next) {
try {
  let orderData=await orderModel.find().sort({createdAt:-1}).populate("userId").lean()
  

  res.render("admin/userManage", { layout: false ,orderData});
} catch (error) {
  next(error)
}
};




exports.orderStatus=async function(req,res,next){
   
    try {
      orderId=req.params.id

    let orderData= await orderModel.findOne({_id:orderId}).lean()
    let stat=orderData.status
    //console.log(stat,"this is the order ");
    let Placed,Shipped,Delivered,cancelled;

    if(stat=="placed"){
      Placed=true

    }else if(stat=="Shipped"){
      Shipped=true
    }else if(stat=="Delivered"){
      Delivered=true
    }else if(stat=="cancelled"){
      cancelled=true
    }
   
   
   

    res.render("admin/orderStatus",{layout:false,orderData,Placed,Shipped,Delivered,cancelled})
    } catch (error) {
      next(error)
    }


}



exports.editStatus= async function(req,res,next){
try {
  let orderId=req.params.id
  //console.log(orderId);
 // console.log(req.body,"this is the  req.body");
  await orderModel.findOneAndUpdate({_id:orderId},{$set:{status:req.body.status}})
  res.redirect("/admin/userManage")
} catch (error) {
  next(error)
}

}




exports.getCoupon= async function(req,res,next){

try {
  couponData = await couponModel.find().lean();
  res.render("admin/couponTable",{layout:false,couponData})
} catch (error) {
  next(error)
}

}



exports.getAddCoupon=function(req,res,next){
  res.render("admin/addCoupon",{layout:false})
}




exports.getEditCoupon= async function(req,res,next){

try {
  id = req.params.id
  couponData = await couponModel.find({ _id: req.params.id }).lean();
  couponData[0].expiryDate = couponData[0].expiryDate.toISOString().substring(0, 10)
  //console.log(couponData,"this is the coupon data");
  couponData = couponData[0];
  //console.log(couponData,"this is th afterorderdAta");
  res.render("admin/editCoupon",{layout:false,id, couponData})
} catch (error) {
  next(error)
}
}




exports.addCoupon=async function(req,res,next){
//  console.log(req.body);
 
    
try {
  couponNameExist = await couponModel.find({ couponName: req.body.couponName }).lean();
  //console.log(couponNameExist,'234567890');
  couponIdExist = await couponModel.find({ couponCode: req.body.couponCode }).lean();
  //console.log(couponIdExist)
  if(couponNameExist[0] || couponIdExist[0])
  return res.json({ message: "the coupon already exist" });
  await couponModel.create(req.body);
 



res.redirect("/admin/couponTable")
} catch (error) {
  next(error)
}
}





exports.editCoupon= async function(req,res,next){
try {
  await couponModel.findOneAndUpdate({ _id: req.params.id }, { $set: { couponName:req.body.couponName,discountAmount:req.body.discountAmount,minAmount:req.body.minAmount,expiryDate:req.body.expiryDate,couponCode:req.body.couponCode} })
        
  res.redirect('/admin/couponTable');
} catch (error) {
  next(error)
}

}




exports.deleteCoupon=async function (req,res,next){

 try {
  await couponModel.deleteOne({ _id: req.params.id });
  res.redirect('/admin/couponTable');
 } catch (error) {
  next(error)
 }
}



exports.validateCoupon=async function(req,res,next){

  
try {
  userId = req.session.user._id;
 
 
  couponExist = await couponModel.findOne({couponCode:req.body.couponId,"users": userId }).lean();
  
  coupons = await couponModel.findOne({ couponCode: req.body.couponId }).lean();

  currentDate = new Date();

  if (coupons) {
  if(couponExist){
   
      return res.json({ message: 'used already' });    
  }
  if (currentDate > coupons.expiryDate) 
  return res.json({ message: "coupon expired" });   
  
   

   if (Number(req.body.total) < Number(coupons.minAmount)){
   return res.json({ message: "less than minimum" });
   }

   
     
      couponTotal = req.body.total - coupons.discountAmount;
      req.session.coupon = coupons;
     return res.json({ message: "succesfull" ,coupons,couponTotal});
  }
  return res.json({ message: "invalid coupon" });
} catch (error) {
  next(error)
}
 
}

exports.salesReport=async function(req,res,next){

  try {
    let data =await orderModel.find({status:"Delivered"}).populate('products.productId' ).lean()
  
   
   res.render('admin/salesReport',{data,layout:false})
  } catch (error) {
    next (error)
  }

}
