const modelDoc = require('../model/modelDoc');
const formidable = require('formidable');
const fs = require('fs');
//数据实体
const ModelDoc = modelDoc.modelDoc;

//下载文件
exports.downloadFile = function(req, res, next){
    let form = formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let filePath = fields.filePath;
        let fileName = filePath.replace('\\', '\/').split('/').pop();
        try{
            //根据filePath下载文件
            res.writeHead(200, {
                'Content-Type':'application/force-download',
                'Content-Disposition':'attachment;filename=' + encodeURI(fileName),
            })
            let readStream = fs.createReadStream(filePath);
            readStream.on('data', (chunk) => {
                res.write(chunk, 'binary');
            })
            readStream.on('end', () => {
                res.end();
            })
        }catch(err){
            res.send({code:-1, message:`下载文件失败,原因是： ${err}`});
        }        
    })
}

//根据数据id获取数据
exports.downloadConfig = function(req, res, next) {
    let oid = req.query.oid;
    console.log(req.query.oid + " " + req.query.type);
    // form.parse(req, (err, fields, files) => {
    //     let oid = fields.oid;
    ModelDoc.findOne({oid:oid}, (err, doc) => {
        if(err){
            res.send({code:-1, message:'配置文件未找到'})
        }else{
            let filePath = doc.path.replace('\\', '\/');
            let fileName = filePath.split('/').pop();
            try{
                //根据filePath下载文件
                res.writeHead(200, {
                    'Content-Type':'application/force-download',
                    'Content-Disposition':'attachment;filename=' + encodeURI(fileName),
                })
                let readStream = fs.createReadStream(filePath);
                // readStream.pipe(res);
                readStream.on('data', (chunk) => {
                    res.write(chunk, 'binary');
                })
                readStream.on('end', () => {
                    res.end();
                })
            }catch(err){
                res.send({code:-1, message:`下载文件失败,原因是： ${err}`});
            }        
        }
    })
    // })
}