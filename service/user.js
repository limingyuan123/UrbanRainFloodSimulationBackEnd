const user = require('../model/user')
const fs = require('fs')
const formidable = require('formidable')
const uuid = require('node-uuid')

var User = user.User;


//login
exports.login = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file) {
        //当服务端全部接收完客户端post的表单数据后触发，表单域数据放到fields里，文件数据放到files里
        User.findOne({
            name: fields.name
        }, (err, doc) => {
            doc
            if (err) {
                res.send({
                    code: -1,
                    message: 'login error'
                });
                return;
            }

            if (!doc) {
                res.send({
                    code: -1,
                    message: 'login failed!'
                })
            } else {
                if (fields.password === doc.password) {
                    let result = {
                        account: doc.name,
                        uid: doc.uid,
                    }

                    res.send({
                        code: 0,
                        message: result
                    })
                } else {
                    res.send({
                        code: -1,
                        message: 'login failed!'
                    })
                }
            }
        })
    })
}

//register
exports.register = function (req, res, next) {

}