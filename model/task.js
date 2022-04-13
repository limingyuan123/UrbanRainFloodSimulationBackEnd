const { ObjectID } = require('mongodb');
const {mongo} = require('mongoose');
const mongoose = require('../lib/mongodb');
const DB = require('../lib/mongodb');

let Mixed = mongoose.mongoose.Schema.Types.Mixed;

//定义Schema表结构
let dataSchema = new mongoose.mongoose.Schema({
    uid:String,//任务id
    oids:Array,//本次耦合任务包含的模型oid
    date:Date,//任务时间
    outputPath:String,
    outputPaths:Array,
},{
    versionKey:false,
    collection:'task',
})

//创建model
let task = DB.DB1.model('task', dataSchema);
exports.task = task;