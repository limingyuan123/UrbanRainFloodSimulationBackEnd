const { ObjectID } = require('mongodb');
const {mongo} = require('mongoose');
const mongoose = require('../lib/mongodb');
const DB = require('../lib/mongodb');

let Mixed = mongoose.mongoose.Schema.Types.Mixed;

//定义Schema表结构
let dataSchema = new mongoose.mongoose.Schema({
    uid:String,
    name:String,//model name
    description:String,
    author:String,
    path:String,
    date:Date,

},{
    versionKey:false,
    collection:'modelDoc',
})

//创建model
let modelDoc = DB.DB1.model('modelDoc', dataSchema);
exports.modelDoc = modelDoc;