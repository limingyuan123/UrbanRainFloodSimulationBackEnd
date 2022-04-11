const { ObjectID } = require('mongodb');
const { mongo, Schema } = require('mongoose');
const mongoose = require('../lib/mongodb')
const DB = require('../lib/mongodb')

//定义schema表结构
var refactorSchema = new mongoose.mongoose.Schema({
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
    versionKey:false,
    collection:'refactor'
})

var refactor = DB.DB1.model('refactor', refactorSchema);

exports.refactor = refactor;