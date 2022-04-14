const task = require('../model/task');
const modelDoc = require('../model/modelDoc');
const formidable = require('formidable');
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
    let serveId = uuid.v4();
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
            let output = arr.join('/');//这个路径不对，文件并未生成到Core文件夹，需要更改
                        
            ls.on('error', (err) => {
                console.log(`cmd调用错误，错误信息为：${err}`)
                res.send({code:-2,message:err.toString()});
                return;
            })
            ls.on('close', (code) => {
                //exit之后
                console.log(`子进程close,退出码为： ${code}`);
                if(code !== 0){
                    res.send({code:-2, message:`cmd调用错误，错误代码为 ${code}`})
                    return;
                }
                fs.readdir(output, (err, f_item) => {
                    if(f_item.length === 0){
                        res.send({ code: -2, message: "cmd调用无结果输出" });
                        return;
                    }else{
                        let doc={
                            uid:serveId,//为了生成唯一文件路径
                            oids:oids,
                            date:date.format(new Date(), 'YYYY-MM-DD HH:mm'),
                            outputPath:output,
                        }                               
                        Task.create(doc,function(err1,small){
                            if(err1){
                                console.log(err1);
                                res.send({code:0,message:err1});
                                return;
                            }                            
                            res.send({
                                code:0,     
                                message:'数据生成成功！',
                                data:output,
                            })
                            return;
                        })
                        
                    }
                })
            })
            //输出cmd执行成功日志
            ls.stdout.on('data', (data) => {
                console.log(`stdout:${data}`);
            })
            //输出cmd执行失败日志
            ls.stderr.on('data', (data) => {
                console.log('错误输出:');
                console.log(data.toString());
                console.log('--------------------');
            });
            ls.on('exit', (code) => {
                console.log(`子进程exit 使用代码 ${code} 退出`);
            })
        })
        
    })
}
