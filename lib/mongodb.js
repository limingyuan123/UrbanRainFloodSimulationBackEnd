const config = require('../config/config')
const mongoose = require('mongoose');

//连接雨洪数据库
let db1 = mongoose.createConnection(config.dataConversionDB, {useNewUrlParser:true});
db1.on('error', console.error.bind(console,'db connection error: '));
db1.once('open', function(){
    console.log("db connected");
})

exports.mongoose = mongoose;
exports.DB1 = db1