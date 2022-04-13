const task = require('../model/task');
const modelDoc = require('../model/modelDoc');
const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const fs = require('fs');
const date=require('silly-datetime');
const uuid=require('node-uuid');
const {spawn} = require('child_process');
const config = require('../config/config');
//数据实体
const Task = task.task;
const ModelDoc = modelDoc.modelDoc;

//调用耦合服务接口并存储task
exports.invoke = function(req, res, next){
    let form = formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        //获取oids
        let oids = fields.oids.split(','), paths = [];
        let promises = [];
        for(let oid of oids){
            let promise = ModelDoc.findOne({oid:oid}).exec();
            promises.push(promise);
        }
        const p = Promise.all(promises);//取得所有查询结果
        p.then((docs) => {
            for(let doc_item of docs){
                paths.push(doc_item.path);
            }
        })

        //调用
        p.then(() => {
            const ls = spawn(config.invokeExe, paths);
            let arr = config.invokeExe.replace('\\', '\/').split('/');
            arr.pop();
            let output = arr.join('/');
            ls.on('error', (err) => {
                console.log(`cmd调用错误，错误信息为：${err}`)
                res.send({code:-2,message:err.toString()});
                return;
            })
            ls.on('close', (code) => {
                //exit之后
                console.log(`子进程close,退出码为： ${code}`);
            })
            ls.stdout.on('data', (data) => {
                console.log(`stdout:${data}`);
            })
            ls.on('exit', (code) => {
                console.log(`子进程使用代码 ${code} 退出`);
                if(code !== 0){
                    res.send({code:-2, message:`cmd调用错误，错误代码为 ${code}`})
                }
                fs.readdir(output, (err, f_item) => {
                    if(f_item.length === 0){
                        res.send({ code: -2, message: "cmd调用无结果输出" });
                        return;
                    }else{
                        res.send({code:0, message:'数据生成成功！',data:output});
                    }
                })
            })
        })
        
    })
}
