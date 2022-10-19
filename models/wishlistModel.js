const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
        // required:true
    },
    products: [
       {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Products'
    },
       quantity: {
           type: Number,
           default:1
            }
        },
       ]
});
const wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = wishlist;