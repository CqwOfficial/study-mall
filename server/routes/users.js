var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login",function(req,res,next){
  var param = {
    userName: req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg: err.message
      });
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });

        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });

        // req.session.user = doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        });
      }
    }
  })
});

// 登出
router.post("/logout", function (req,res,next) {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:"",
    result:""
  })
})

router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:"",
      result:req.cookies.userName ||''
    })
  }else{
    res.json({
      status:'1',
      msg:"未登录",
      result:""
    });
  }
})

// 查找购物车
router.get("/getCartCount", function (req,res,next) {
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
      
    })
  }
  
})

// 查询当前用户的购物车数据
router.get("/cartList", function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        doc.cartList;
        res.json({
          status:'0',
          msg: '',
          result: doc.cartList
        });
      }
    }
  })
})


// 购物车删除
router.post("/cart/del", function (req,res,next) {
  var userId = req.cookies.userId,productId = req.body.productId;
  User.update({
    userId:userId
  }, {
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg: '',
        result: 'cart 删除成了'
      });
    }
  })
})

// 修改商品数量
router.post("/cartEdit", function (req,res,next) {
  var userId = req.cookies.userId, 
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg: '',
        result: '商品数量更新成功'
      });
    }
  })
})

router.post("/editCheckAll", function (req,res,next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId}, function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        });
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg: '',
              result: '全选接口成了'
            });
          }
        })
      }
    }
  })
})

//查询用户地址接口
router.get("/addressList", function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      });
    }else {
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})

router.post("/setDefault", function(req,res,next){
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    })
  }else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var addressList =doc.addressList;
        addressList.forEach((item) =>{
          if(item.addressId == addressId){
            item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });

        doc.save(function(err1,doc1){
          if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            });
          }else {
            res.json({
              status:'0',
              msg:'',
              result:''
            });
          }
        })
      }
    })
  }
  
})

// 删除地址接口
router.post("/delAddress", function (req,res,next) {
  var userId = req.cookies.userId,
  addressId = req.body.addressId;
  User.update({
    userId:userId
  }, {
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg: '',
        result: 'address 删除成了'
      });
    }
  })
})

//订单生成
router.post("/payMent", function (req,res,next) {
  var userId = req.cookies.userId,
  addressId = req.body.addressId,
  orderTotal = req.body.orderTotal;
  User.findOne({userId:userId}, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var address = '',
      goodsList = [];
      // 获取当前用户的地址信息
      doc.addressList.forEach(item =>{
        if(addressId === item.addressId){
          address = item;
        }
      })  
      //  获取用户购物车的购买商品
      doc.cartList.filter(item =>{
        if(item.checked =='1'){
          goodsList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);

      var sysDate = new Date().Format('yyyyMMddhhMMss');
      var createDate = new Date().Format('yyyy-MM-dd hh:MM:ss');
      var orderId = platform+r1+sysDate+r2;


      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };

      doc.orderList.push(order);
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      })
    }
  })
})

// 根据订单id查询订单信息
// router.get("/orderDetail", function (req,res,next) {
//   var userId = req.cookies.userId,
//   orderId = req.query.orderId;
//   User.findOne({userId:userId}, function (err,userInfo) {
//     if(err){
//       res.json({
//         status:'1',
//         msg:err.message,
//         result:''
//       });
//     }else{
//       var orderList = userInfo.orderList;
//       if(orderList.length > 0){
//         var orderTotal = 0;
//         orderList.forEach(item =>{
//           if(item.orderId == orderId){
//             orderTotal = item.orderTotal;
//           }
//         })
//         if(orderTotal>0){
//           res.json({
//             status:'0',
//             msg:'',
//             result:{
//               orderId:orderId,
//               orderTotal:orderTotal
//             }
//           })
//         }else{
//           res.json({
//             status:'002',
//             msg:'无此订单号',
//             result:''
//           });
//         }
        
//       }else{
//         res.json({
//           status:'001',
//           msg:'该用户未创建订单',
//           result:''
//         });
//       }
//     }
//   })
// })

router.get("/orderDetail", function (req,res,next) {
  var userId = req.cookies.userId,
  orderId = req.query.orderId;
  
  function back(status,msg,result){
      res.json({
          status: status,
          msg: msg,
          result: result
      });
  };
  
  async function asyncUserInfo(err,userInfo){
    try{
      var orderList = userInfo.orderList;
      if(orderList.length > 0){
          var orderTotal = 0;
          orderList.forEach(item =>{
            if(item.orderId == orderId){
              orderTotal = item.orderTotal;
            }
          })
          if(orderTotal>0){
              var backResult = {
                  orderId: orderId,
                  orderTotal: orderTotal
              }
              back("0", '', backResult);
          }else{
            back("002","没有这个订单号",'')
          }
      }else{
        back("001","该用户未创建订单",'')
      }
    }catch(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }
  }
  User.findOne({userId:userId}, asyncUserInfo)
})




let demo = async function(){
  let url = "/payMent";
  function asyncPayMent (url){

    return new Promise(function(resolve, reject){
        router.post(url, function (req,res,next) {
  
            var userId = req.cookies.userId,
            addressId = req.body.addressId,
            orderTotal = req.body.orderTotal;
            resolve(userId,addressId,orderTotal);
        })
    })
  }
  let asyncPayMente = await asyncPayMent(url);
  console.log(asyncPayMente)
}


module.exports = router;
