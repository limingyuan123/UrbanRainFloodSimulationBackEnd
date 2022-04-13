const { ObjectID } = require('mongodb');
const { mongo } = require('mongoose');
const mongoose = require('../lib/mongodb')
const DB = require('../lib/mongodb')

let Mixed = mongoose.mongoose.Schema.Types.Mixed;

//定义Schema，表结构
let dataSchema = new mongoose.mongoose.Schema({
    name:String,
    description:String,
    uname:String,
    uemail:String,
    author:String,
    datetime:String,
    snapshot:String,
    available:String,
    details:String,
    uid:String,
    associate:String,
    delete:String,
    deletetime:String,
},{
    versionKey: false,
    collection:'datamap'
})

//创建model
let dataMap = DB.DB1.model('datamap', dataSchema)

exports.dataMap = dataMap;