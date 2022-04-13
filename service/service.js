const datamap = require('../model/datamap');
const refactor = require('../model/refactor');
const modelDoc = require('../model/modelDoc');
const formidable = require('formidable');
// const { ObjectId } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const fs = require('fs');
const convert = require('xml-js');
const date=require('silly-datetime');
const uuid=require('node-uuid');
const config = require('../config/config');
//数据实体
const DataMap = datamap.dataMap;
const Refactor = refactor.refactor;
const ModelDoc = modelDoc.modelDoc;

//获取服务数据
exports.getServiceData = function (req, res, next) {
    let form = formidable.IncomingForm();
    id = req.query.oid;
    console.log(req.query.oid + " " + req.query.type);

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("yes");
    }
    let type = req.query.type;
    let collection;
    if (type === "map") {
        collection = DataMap;
    } else if(type === 'refactor'){
        collection = Refactor;
    }
    collection.findById(id, (err, doc) => {
        if (err) {
            res.send({
                code: -1,
                message: err
            });
            return;
        };

        if (!doc) {
            res.send({
                code: -1,
                message: 'doc is null'
            })
            return;
        } else {
            res.send({
                code: 0,
                message: {
                    name: doc.name,
                }
            })
        }

    })
}

//解析耦合文档，并存储入库
exports.coupleDocument = function (req, res, next) {
    let form = formidable.IncomingForm();
    let uid = uuid.v4();
    let dirPath = __dirname + '/../data/' + uid;
    fs.mkdir(dirPath, (err) => {
        if(err) throw err

        form.uploadDir=dirPath
        form.keepExtensions=true
        form.parse(req, (err, fields, files) => {
            //上传的文件会在该服务器下有一个路径做缓存，所以可以直接对该路径下的文件进行处理
            let filePath = files.datafile.path;
            let fileName = files.datafile.name;
            //将filePath下的文件改名
            fs.rename(filePath, `${dirPath}/${fileName}`, (err)=>{
                if(err){
                    console.log('更改文件名出错')
                }else{
                    filePath = dirPath + '/' + fileName;
                    let doc={
                        oid:fields.oid,//为了与前端的模型信息对应
                        uid:uid,//为了生成唯一文件路径
                        name:fields.name,
                        description:fields.description,
                        path:filePath,
                        date:date.format(new Date(), 'YYYY-MM-DD HH:mm'),
                    }
                    
                    let xml = fs.readFileSync(filePath, 'utf-8');       
                    ModelDoc.create(doc,function(err1,small){
                        if(err1){
                            console.log(err1);
                            res.send({code:0,message:err1});
                            return
                        }
                        console.log("upload file success")
        
                        res.send({
                            code:0,    
                            data:xml,
                        })
                        return
                    })
                }
            })
        })
    })    
}