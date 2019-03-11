var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId" : String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "_id":Object,
      "productId": String,
      "productName":String,
      "productPrice":String,
      "productImage":String,
      "checked":Number,
      "productNum":Number
    }
  ],
  "addressList":Array

})
module.exports = mongoose.model("User",userSchema);