const user = require('../service/user')
const service = require('../service/service')

//user
//login
exports.login = user.login;

//register
exports.register = user.register;

// getServiceData
exports.getServiceData = service.getServiceData;

exports.coupleDocument = service.coupleDocument;