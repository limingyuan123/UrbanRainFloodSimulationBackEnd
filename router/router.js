const user = require('../service/user');
const service = require('../service/service');
const downloadService = require('../service/downloadService');
const taskService = require('../service/taskService');

//user
//login
exports.login = user.login;

//register
exports.register = user.register;

// getServiceData
exports.getServiceData = service.getServiceData;

//解析耦合文档
exports.coupleDocument = service.coupleDocument;

//调用耦合服务
exports.invoke = taskService.invoke;

//调用耦合服务
exports.downloadFile = downloadService.downloadFile;

//下载配置文档文件
exports.downloadConfig = downloadService.downloadConfig;