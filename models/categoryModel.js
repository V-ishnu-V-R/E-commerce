const mongoose = require("mongoose");
const categorySchema=new mongoose.Schema({
    Category:{
        type:String,
        required:true
    }
})
const Category =  mongoose.model("Categories", categorySchema);
module.exports = Category;
