let user = require('./User');

console.log(`userName: ${user.userName}`)
console.log(`I'm ${user.userName}, I will say ${user.sayHello()}`);  

let http = require('http');
let url = require('url');
let util = require('util');

let server = http.createServer((req,res)=>{
  res.statusCode = 200;

  res.setHeader("Content-Type","text/plain; charset=utf-8");

  console.log(`url: ${req.url}`)
  console.log(`parse: url.parse(req.url)`)
  console.log(`inspect: ${util.inspect(url.parse(req.url))}`)
  // util.inspect(url.parse(req.url)) 
  // inspect将对象转化为字符串输出

  res.end(util.inspect(url.parse(req.url))); // 拿到浏览器端访问的地址
});

server.listen(3000, '127.0.0.1', ()=>{
  console.log(`服务器已经运行，请打开浏览器 : http//127.0.0.1:3000`);
});