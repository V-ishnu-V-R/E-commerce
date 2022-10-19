module.exports = {
    totalAmount: (cartdata) => {
        console.log(cartdata);
        total = cartdata.products.reduce((acc, curr) => {
            
            acc += curr.productId.sellingPrice * curr.quantity;
            return acc;
        }, 0);
        return total;
    }
}