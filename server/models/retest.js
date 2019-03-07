var mongoose = require('mongoose')
var Schema1 = mongoose.Schema;

var produtSchema2 = new Schema1({
  "_id": Object,
  "productId" : {type: String},
  "productName" : String,
  "productPrice" : Number,
  "productImage" : String,
});

module.exports = mongoose.model('retest',produtSchema2);