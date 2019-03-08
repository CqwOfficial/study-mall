var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // 获取cookie信息，转换
var logger = require('morgan'); // 日志输出
var bodyParser = require('body-parser');

//  抓路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goods= require('./routes/goods');
var retest = require('./routes/retest');
var caonima = require('./routes/caonima');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.get("/hello",function(req,res){
  res.send("你好");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next){
  if(req.cookies.userId){
    next();
  }else{
    // console.log(`path:${req.path}, originalUrl:${req.originalUrl}`);
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path == '/retest/list'){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result: ''
      });
    }
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goods);
app.use('/retest',retest);
app.use('/caonima',caonima)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
