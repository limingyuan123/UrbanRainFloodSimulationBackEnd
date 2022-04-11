const { mongo } = require('mongoose');
const mongoose = require('../lib/mongodb')
const DB = require('../lib/mongodb')

var Mixed = mongoose.mongoose.Schema.Types.Mixed;

//定义Schema，表结构
var dataSchema = new mongoose.mongoose.Schema({
    uid:String,
    name:String,
    email:String,
    password:String,
},{
    versionKey: false,
    collection: "user"
})

//创建model
var user = DB.DB1.model('user', dataSchema)

exports.User = user;