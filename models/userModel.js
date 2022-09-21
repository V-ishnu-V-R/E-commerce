const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const signupSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    // unique:true
  },
  number: Number,
  password: String,
  confirmPassword: String,
  active:{
    type:Boolean,
    default:true
  }
});

signupSchema.pre("save", async function(next){
      
          // console.log(`the current pass is ${this.password}`);
          this.password= await bcrypt.hash(this.password,10)
          // console.log(`the current pass is ${this.password}`);
          
      
      next()
  })
const User =  mongoose.model("User", signupSchema);
module.exports = User;



















//generatig tokens
// signupSchema.methods.generateAuthToken= async function(){
//     try{

//         console.log(this._id);
//         const token= jwt.sign({_id:this._id},"mynameisvishnuandthisasecretkeythatipassed")
//         console.log(token);
//         return token

//     }catch(err){
//         res.send( "this is the error part"+err);
//         console.log("the error part"+err);

//     }
// }
// //converting password in to hash
// signupSchema.pre("save", async function(next){
//     if(this.isModified("password")){
//         console.log(`the current pass is ${this.password}`);
//         this.password=await bcrypt.hash(this.password,10)
//         console.log(`the current pass is ${this.password}`);
//         this.confirmPassword=undefined
//     }
//     next()
// })
