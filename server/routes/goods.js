var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 连接mongo数据库
mongoose.connect('mongodb://mallone:123456@127.0.0.1:27017/mall',{useNewUrlParser:true});
mongoose.connection.on("connected", ()=>{
  console.log("success mongo")
});
mongoose.connection.on("error", ()=>{
  console.log("failed mongo")
});
mongoose.connection.on("disconnected", ()=>{
  console.log("disconnected mongo")
});

// 查询商品列表数据
router.get("/",(req,res,next)=>{
  let page = parseInt(req.param("page")); // req.param 获取值
  let pageSize = parseInt(req.param("pageSize"));
  console.log(typeof(pageSize))
  let sort = req.param("sort");
  let skip = ()=>{
    if(page===1){
      return pageSize
    }else {
      return (page-1)*pageSize
    }
  };
  let params = {};

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  // skip 跳过x条数据
  // limit 获取当前位置开始的x个数据
  goodsModel.sort({'salePrice':sort});

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
})

// 加入购物车
router.post("/goods/addCart",function(req,res,next){
  var userId = "10001";
  var productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId}, function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      console.log("userDoc:"+userDoc)
      if(userDoc){
        Goods.findOne({productId:productId},function(err,doc){
          if(err1){
            res.json({
              status:"1",
              msg:err.message
            })
          }else{
            if(doc){
              doc.productNum =1;
              doc.checked = 1;
              User.cartList.push(doc);
              User.save(function(err2,doc2){
                if(err2){
                  res.json({
                    status:"1",
                    msg:err2.message
                  })
                }else{
                  res.json({
                    status:"0",
                    msg:'',
                    result:'success'
                  })
                }
              })
            }
          }
        })
      }
    }
  })
})

module.exports = router;