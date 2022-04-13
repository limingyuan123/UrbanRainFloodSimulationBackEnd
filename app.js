const express = require('express');
const router = require('./router/router')
const config = require('./config/config')
// const MongoStore = require('connect-mongo')(session)

const bodyParser = require('body-parser');
const { Session } = require('inspector');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//创建application/json解析
const jsonParser = bodyParser.json();

//创建application/x-www-form-urlencoded
const urlencodeParser = bodyParser.urlencoded({extended:false});

//CORS跨域设置
app.all('*', function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:1708");
    res.header('Access-Control-Allow-Origin', '*') // 使用session时不能使用*，只能对具体的ip开放。
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});

//user login
app.post('/login', router.login);

//user register
app.post("/register", router.register);

//getServiceData
app.get("/getServiceData", router.getServiceData);

app.post("/coupleDocument", router.coupleDocument);

app.post('/invoke', router.invoke);

app.post('/downloadFile', router.downloadFile);

app.get('/downloadConfig', router.downloadConfig);

app.listen(config.port,()=>{
    console.log(config.port,process.pid);
    console.log("server online");
})

//为防止接口调用错误导致的崩溃，设置全局错误捕获
process.on('uncaughtException', function (err) {
  console.log('Caught Exception:' + err);//直接捕获method()未定义函数，Node进程未被退出。
});