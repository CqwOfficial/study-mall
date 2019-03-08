var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Retests = require('../models/retest');

mongoose.connect('mongodb://testone:123456@127.0.0.1:27017/testone',{useNewUrlParser:true});
mongoose.connection.on("connected", ()=>{
  console.log("success mongo")
});
mongoose.connection.on("error", ()=>{
  console.log("failed mongo")
});
mongoose.connection.on("disconnected", ()=>{
  console.log("disconnected mongo")
});

router.get('/list', function(req, res, next) {
  

  let page = parseInt(req.param("page")); // req.param 获取值
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  var priceGt = '', priceLte = '';
  
  let params = {};
  if(priceLevel !="all"){
    switch(priceLevel){
      case '0': priceGt =0;priceLte=99;break;
      case '1': priceGt =100;priceLte=499;break;
      case '2': priceGt =500;priceLte=999;break;
      case '3': priceGt =1000;priceLte=50000;break;
    }
    params = {
      productPrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Retests.find(params).skip(skip).limit(pageSize);
  console.log(goodsModel)
  // skip 跳过x条数据
  // limit 获取当前位置开始的x个数据
  goodsModel.sort({'productPrice':sort});

  goodsModel.exec((err, doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      });
    }else{
      res.json({
        status: 0,
        msg:'',
        result:{
          count: doc.length,
          list:doc
        }
      })
    }
  })
});

// 加入购物车
router.post("/addCart", function (req,res,next) {

  var userId = '10001',productId = req.body.productId;
  var User = require('../models/user');

  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
      res.json({ status:"1", msg:err.message+'user表错误'});
    }else{
      console.log("userDoc:"+userDoc);

      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach(function(item) {
          if(item.productId == productId){
            goodsItem = item;
            if(item.productNum == "undefined"){
              item.productNum = new Number(1);
              item.productNum++;
            }else{
              item.productNum++;
            }
            
          }
        });
      
        if(goodsItem){
        userDoc.save(function (err2,doc2) {
          if(err2){ 
            res.json({ status:"1", msg:err2 })
          }else{
            res.json({status:'0', msg:'', result:'成了'})
          }
        })
      
      }else{
        Retests.findOne({productId:productId}, function (err1,doc) {
          if(err1){
            res.json({ status:"1", msg:err1.message+'retest表productid有问题'})
          }else{
            
            if(doc){
              doc.productNum = 1;
              doc.checked = 1;
              userDoc.cartList.push(doc);
              userDoc.save(function (err2,doc2) {
                if(err2){
                  res.json({ status:"1", msg:err2 })
                }else{
                  res.json({ status:'0', msg:'',result:'第一次成了'+doc })
                }
              })
            }
          }
        });
      }
    }
    }
  })
});



module.exports = router;
