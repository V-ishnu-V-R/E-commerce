const mongoose =require("mongoose")
const productSchema = new mongoose.Schema({
    brand:String,
    name :String,
   price:Number,
   description:String,
   category:String,
   
   sellingPrice:Number,
   imagepath:Array


  });
  const Product =  mongoose.model("Products", productSchema);
module.exports = Product; 
