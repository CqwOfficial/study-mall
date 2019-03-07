var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Retests = require('../models/retest');
//创建application/json解析
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//创建application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended: false});

mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/testone',{useNewUrlParser:true});
mongoose.connection.on("connected", ()=>{
  console.log("success mongo")
});
mongoose.connection.on("error", ()=>{
  console.log("failed mongo")
});
mongoose.connection.on("disconnected", ()=>{
  console.log("disconnected mongo")
});

router.get('/', function(req, res, next) {
  

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
router.get("/addCart",urlencodedParser,function(req,res,next){
  res.send('nihao')
})
// router.post("/ee",jsonParser,function(req,res,next){
//   res.send('nihao')
// })



module.exports = router;
